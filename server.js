const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
    [name, email, hash]
  );

  res.json(user.rows[0]);
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    // ❌ USER NOT FOUND
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    // ❌ WRONG PASSWORD
    if (!valid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // ✅ SUCCESS
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get tasks
app.get("/api/tasks", auth, async (req, res) => {
  const tasks = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [req.user.id]);
  res.json(tasks.rows);
});

// Create task
app.post("/api/tasks", auth, async (req, res) => {
  const { title, description } = req.body;
  const task = await pool.query(
    "INSERT INTO tasks(title,description,user_id) VALUES($1,$2,$3) RETURNING *",
    [title, description, req.user.id]
  );
  res.json(task.rows[0]);
});

// Update task
app.put("/api/tasks/:id", auth, async (req, res) => {
  const { status, title, description } = req.body;
  const task = await pool.query(
    "UPDATE tasks SET status=$1, title=$2, description=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
    [status, title, description, req.params.id, req.user.id]
  );
  res.json(task.rows[0]);
});

// Delete task
app.delete("/api/tasks/:id", auth, async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2", [req.params.id, req.user.id]);
  res.json({ msg: "Deleted" });
});

app.listen(process.env.PORT, () => console.log("Server running"));
