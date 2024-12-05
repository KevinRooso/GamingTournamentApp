import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/loginstyle.css";
import "../styles/registerstyle.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);    

    const user = {
      name,
      username,
      email,
      password,
      contact,
    };

    try {
      const data = await registerUser(user);
      if(data){
        localStorage.setItem("token", data.token);
        navigate('/dashboard');
        navigate(0);
      }
    } catch (err) {     
      setError(err.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="register-card">
        <h2 className="text-center mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={register}>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                />
              </div>
            </div>

            <div className="col-6">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                />
              </div>
            </div>

            <div className="col-6">
              <div className="form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter Contact Number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            REGISTER
            {loading ? <span className="loader"></span> : ""}
          </button>
        </form>

        <p className="mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-primary">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
