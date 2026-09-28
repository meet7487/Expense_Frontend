// Registration.jsx
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
import "./Registration.css";

function Registration() {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    gender: "",
    password: "",
  });

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!data.name || !data.username || !data.email || !data.password) {
      setMsg("Please fill all required fields");
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/register`, data);

      setMsg("Registration successful. Please login.");
      setSeverity("success");
      setOpen(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMsg("Registration failed");
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <div className="auth-container">
      <Container maxWidth="sm">
        <Box className="auth-box">
          <Typography variant="h5" className="auth-title" gutterBottom>
            Register
          </Typography>

          <TextField fullWidth margin="normal" label="Name" name="name" value={data.name} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Username" name="username" value={data.username} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" value={data.email} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Address" name="address" value={data.address} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Gender" name="gender" value={data.gender} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Password" type="password" name="password" value={data.password} onChange={handleChange} />

          <Button
            fullWidth
            variant="contained"
            className="auth-button"
            onClick={handleRegister}
          >
            Register
          </Button>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="text"
            className="auth-link"
            onClick={() => navigate("/")}
          >
            <p style={{color:"black"}}> Already have an account? Login</p>
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

export default Registration;
