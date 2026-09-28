// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "./api";
import "./Login.css";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!data.username || !data.password) {
      setMsg("Please enter username and password");
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, data);

      if (res.data && res.data.success && res.data.token && res.data.userId) {
        localStorage.setItem("isValidate", "true");
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("token", res.data.token);

        setMsg("Login successful");
        setSeverity("success");
        setOpen(true);

        navigate("/expense");
      } else {
        setMsg("Login failed");
        setSeverity("error");
        setOpen(true);
      }
    } catch (err) {
      setMsg("Invalid username or password");
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <div className="auth-container">
      <Container maxWidth="sm">
        <Box className="auth-box">
          <Typography variant="h5" className="auth-title" gutterBottom>
            Login
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={data.username}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            className="auth-button"
            onClick={handleSubmit}
          >
            Login
          </Button>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="text"
            className="auth-link"
            
            onClick={() => navigate("/register")}
          >
          {/* Login Button */}
           <p style={{color:"black"}}> Don’t have an account? Register</p>
          </Button>
        </Box>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
        >
          <Alert severity={severity} onClose={() => setOpen(false)}>
            {msg}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default Login;
