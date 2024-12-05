import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/loginstyle.css";
import { loginUser } from "../services/AuthService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      username: username,
      password: password,
    };

    try {
      const data = await loginUser(user);
      if(data){
        localStorage.setItem("token", data.token);
        navigate('/dashboard');
        navigate(0);
      }
    } catch (err) {
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="username"
              className="form-control"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('');
              }}
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            LOGIN
            {loading ? <span className="loader"></span> : ""}
          </button>
        </form>

        <p className="mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary">
            Sign Up
          </Link>
        </p>
        
      </div>
    </div>
  );
}
