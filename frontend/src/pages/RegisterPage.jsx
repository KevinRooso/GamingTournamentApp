import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/loginstyle.css";
import "../styles/registerstyle.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const errors = {};

    // Email Validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address";
      valid = false;
    }

    // Contact Number Validation
    const contactPattern = /^[0-9]{10}$/;
    if (!contactPattern.test(contact)) {
      errors.contact = "Please enter a valid contact number";
      valid = false;
    }

    // Password Validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      // Check password length
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
        valid = false;
      }
      // Check for lowercase letter
      else if (!/[a-z]/.test(password)) {
        errors.password =
          "Password must contain at least one lowercase letter.";
        valid = false;
      }
      // Check for uppercase letter
      else if (!/[A-Z]/.test(password)) {
        errors.password =
          "Password must contain at least one uppercase letter.";
        valid = false;
      }
      // Check for number
      else if (!/\d/.test(password)) {
        errors.password = "Password must contain at least one number.";
        valid = false;
      }
      // Check for special characters
      else if (!/[^A-Za-z\d]/.test(password)) {
        errors.password = "Password must contain at least one special character.";
        valid = false;
      } 
    }

    // Confirm Password Validation
    if (password.localeCompare(confirmPassword) != 0) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const register = async (e) => {
    e.preventDefault();

    // Perform form validation
    if (!validateForm()) {
      toast.error("Invalid Fields");
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
      if (data) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
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
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  placeholder="Enter Email"
                  required
                />
                {formErrors.email && (
                  <div className="text-danger form-error">
                    {formErrors.email}
                  </div>
                )}
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
                {formErrors.contact && (
                  <div className="text-danger form-error">
                    {formErrors.contact}
                  </div>
                )}
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
            {formErrors.password && (
              <div className="text-danger form-error">
                {formErrors.password}
              </div>
            )}
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
            {formErrors.confirmPassword && (
              <div className="text-danger form-error">
                {formErrors.confirmPassword}
              </div>
            )}
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
