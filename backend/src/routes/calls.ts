import { Router } from "express";
import { pool } from "../db/index";

const router = Router();

// GET /calls // List all calls
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM calls");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /calls //Create new call
router.post("/", async (req, res) => {
  const { to, scriptId, metadata } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO calls (payload, status, attempts, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [{ to, scriptId, metadata }, "PENDING", 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

// DELETE /calls/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM calls WHERE id=$1", [id]);
    res.json({ message: "Call deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PATCH /calls/id //Update call only if status is pending
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { to, scriptId, metadata } = req.body;

  try {

    const check = await pool.query("SELECT status FROM calls WHERE id=$1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Call not found" });
    }

    if (check.rows[0].status !== "PENDING") {
      return res.status(400).json({ error: "Call cannot be updated unless status is PENDING" });
    }

    
    const result = await pool.query(
      "UPDATE calls SET payload=$1 WHERE id=$2 RETURNING *",
      [{ to, scriptId, metadata }, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /metrics - Return count of calls per status
router.get("/metrics", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM calls
      GROUP BY status
    `);

    const metrics: Record<string, number> = {};
    result.rows.forEach((row) => {
      metrics[row.status] = parseInt(row.count, 10);
    });

    res.json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});



