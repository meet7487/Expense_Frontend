import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { useNavigate } from "react-router-dom";
import "./ExpenseNavbar.css";

function ExpenseNavbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar position="static" className="standalone-navbar">
      <Toolbar className="standalone-navbar__toolbar">
        <Box className="standalone-navbar__brand" sx={{ flexGrow: 1 }}>
          <span><AccountBalanceWalletRoundedIcon /></span>
          <Typography variant="h6">Expense Tracker</Typography>
        </Box>

        <Box className="standalone-navbar__actions">
          <Typography variant="body1" className="standalone-navbar__user">
            {userId}
          </Typography>

          <Button
            variant="contained"
            color="error"
            className="standalone-navbar__logout"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ExpenseNavbar;
