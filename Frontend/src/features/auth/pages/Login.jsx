import React, { useState } from "react";
import "./auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../Hooks/useAuth";
import Loading from "../components/Loading";


const Login = () => {
  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({email , password});
    navigate('/');
  };

  if(loading){
    return <Loading />
  }

  return (
    <main>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-tabs">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <br />
          <br />
          <button className="btn" type="submit">
            Login
          </button>

          <p>
            Don't have an account?{" "}
            <Link className="link" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
