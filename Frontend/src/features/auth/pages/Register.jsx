import React from "react";
import "./auth.form.scss";
import { useNavigate, Link } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };
  return (
    <main>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div className="input-tabs">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <br />
          <br />
          <button className="btn" type="submit">
            Register
          </button>

          <p>
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
