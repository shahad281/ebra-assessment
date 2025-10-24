import { pool } from "../db/index";
import { invokeAiCall } from "./aiCallApi";


// no more than 30 callas start at the same time
const MAX_CONCURRENT_CALLS = 30;

export async function worker() {
  while (true) {
    try {
      // compute how many call in progress?
      const { rows: activeRows } = await pool.query(
        "SELECT COUNT(*) AS count FROM calls WHERE status='IN_PROGRESS'"
      );
      const activeCount = parseInt(activeRows[0].count, 10);
      const slotsAvailable = MAX_CONCURRENT_CALLS - activeCount;

      if (slotsAvailable <= 0) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      const res = await pool.query(
        "SELECT * FROM calls WHERE status='PENDING' ORDER BY created_at LIMIT $1 FOR UPDATE SKIP LOCKED",
        [slotsAvailable]
      );

      if (res.rows.length === 0) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      for (const call of res.rows) {
        await pool.query(
          "UPDATE calls SET status='IN_PROGRESS', started_at=NOW() WHERE id=$1",
          [call.id]
        );

        invokeAiCall(
          call.payload.to,
          call.payload.scriptId,
          "http://localhost:3000/callbacks/call-status"
        )
          .then((data) => {
            console.log("Call invoked:", data.callId);
          })
          .catch((err) => {
            console.error("AI Call error for callId", call.id, err);
          });

        // after 30s change the state of the call randomly
        setTimeout(async () => {
          try {
            const newStatus = Math.random() < 0.8 ? "COMPLETED" : "FAILED";
            await pool.query(
              "UPDATE calls SET status=$1, ended_at=NOW() WHERE id=$2",
              [newStatus, call.id]
            );
            console.log(`Call ${call.id} marked as ${newStatus}`);
          } catch (err) {
            console.error("Error updating call status:", err);
          }
        }, 30000); 
      }
    } catch (err) {
      console.error("Worker error:", err);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
