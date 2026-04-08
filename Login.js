
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.email || !form.password) {
      setMsg("Please enter both email and password");
      return;
    }

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      // setMsg("Login successful! Redirecting...");
      setTimeout(() => {
        setMsg("");
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login failed");
    }
  };

  // Inline styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(to right, #4facfe, #00f2fe)",
      fontFamily: "Arial, sans-serif",
    },
    box: {
      background: "#fff",
      padding: "40px 30px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      width: "350px",
    },
    heading: { textAlign: "center", marginBottom: "20px" },
    input: {
      width: "100%",
      padding: "12px 10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxSizing: "border-box",
    },
    passwordWrapper: {
      display: "flex",
      alignItems: "center",
    },
    eyeIcon: { cursor: "pointer", marginLeft: "8px", color: "#555" },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#4facfe",
      border: "none",
      color: "white",
      fontSize: "16px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "0.3s",
    },
    buttonDisabled: {
      backgroundColor: "#aaa",
      cursor: "not-allowed",
    },
    registerLink: {
      textAlign: "center",
      marginTop: "15px",
      fontSize: "14px",
    },
    message: {
      textAlign: "center",
      color: "red",
      marginBottom: "10px",
      fontWeight: "bold",
    },
  };

  // Check if form is valid
  const isFormValid = form.email && form.password;

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Login</h2>

        {msg && <div style={styles.message}>{msg}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ ...styles.input, marginBottom: 0 }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          style={isFormValid ? styles.button : { ...styles.button, ...styles.buttonDisabled }}
          disabled={!isFormValid}
          onMouseOver={(e) =>
            isFormValid ? (e.target.style.backgroundColor = "#00aaff") : null
          }
          onMouseOut={(e) =>
            isFormValid ? (e.target.style.backgroundColor = "#4facfe") : null
          }
        >
          Login
        </button>

        <div style={styles.registerLink}>
          New user? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;





