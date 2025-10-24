import { Router } from "express";
import { pool } from "../db/index";

const router = Router();

// POST /callbacks/call-status
router.post("/call-status", async (req, res) => {
  const { callId, status, completedAt } = req.body;
  try {
    await pool.query(
      "UPDATE calls SET status=$1, ended_at=$2 WHERE id=$3",
      [status, completedAt, callId]
    );
    res.json({ message: "Call status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
