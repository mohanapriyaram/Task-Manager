
import React, { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert("Please enter both Title and Description!");
      return;
    }
    await API.post("/tasks", form);
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  const toggle = async (task) => {
    await API.put(`/tasks/${task.id}`, {
      title: task.title,
      description: task.description,
      status: !task.status,
    });
    fetchTasks();
  };

  const del = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ title: task.title, description: task.description });
  };

  const saveEdit = async (id) => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      alert("Please enter both Title and Description!");
      return;
    }
    await API.put(`/tasks/${id}`, {
      title: editForm.title,
      description: editForm.description,
      status: tasks.find((t) => t.id === id).status,
    });
    setEditingId(null);
    setEditForm({ title: "", description: "" });
    fetchTasks();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "" });
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5", // light grey background
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Task Manager</h2>

      <button
      onClick={logout}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
    >
      Logout
    </button>

      {/* Add Task Form */}
      <form
        onSubmit={addTask}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ flex: 1, padding: "8px 12px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ flex: 2, padding: "8px 12px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={!form.title.trim() || !form.description.trim()}
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: !form.title.trim() || !form.description.trim() ? "#ccc" : "#3498db", // soft blue
            color: "white",
            cursor: !form.title.trim() || !form.description.trim() ? "not-allowed" : "pointer",
          }}
        >
          Add
        </button>
      </form>

      {/* Tasks List */}
      {tasks.map((t) => (
        <div
          key={t.id}
          style={{
            backgroundColor: "#fff", // white task card
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // soft shadow
          }}
        >
          {editingId === t.id ? (
            <>
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                style={{ padding: "8px 12px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                style={{ padding: "8px 12px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => saveEdit(t.id)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#2ecc71", // green
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#95a5a6", // grey
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      textDecoration: t.status ? "line-through" : "none",
                      color: t.status ? "#7f8c8d" : "#333",
                    }}
                  >
                    {t.title}
                  </h3>
                  <p
                    style={{
                      margin: "5px 0",
                      textDecoration: t.status ? "line-through" : "none",
                      color: t.status ? "#7f8c8d" : "#555",
                    }}
                  >
                    {t.description}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => toggle(t)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: t.status ? "#2ecc71" : "#f1c40f", // soft green / yellow
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {t.status ? "Done" : "Pending"}
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#3498db", // soft blue
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(t.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#e74c3c", // soft red
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}