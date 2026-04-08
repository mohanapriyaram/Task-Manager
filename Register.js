import React, { useState } from "react";
import API from "../api";
import { useNavigate,Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name:"", email: "", password: "" });
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("/auth/register", form);
    setMsg("Registration successful! Please login");

    
    // Hide message and redirect after 3 seconds
setTimeout(() => {
  setMsg("");       // hide success message
  navigate("/login"); // go to login page
}, 3000);

  } catch (err) {
    setMsg(err.response?.data?.msg || "Registration failed");
  }
};
  return (
  <div className="container">
    <form className="card" onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input className="input" placeholder="Name"
        onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input className="input" placeholder="Email"
        onChange={(e)=>setForm({...form,email:e.target.value})} />

      <input type="password" className="input" placeholder="Password"
        onChange={(e)=>setForm({...form,password:e.target.value})} />

      <button className="btn">Register</button>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <p style={{ textAlign: "center", marginTop: "15px" }}>
  Already have an account?{" "}
  <Link to="/login" style={{ color: "blue", fontWeight: "bold" }}>
    Go to Login
  </Link>
</p>
    </form>
  </div>
);
}
