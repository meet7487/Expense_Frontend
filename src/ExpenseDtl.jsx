// ExpenseDtl.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Snackbar,
  Alert,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import axios from "axios";
import { API_BASE_URL } from "./api";
import { useNavigate } from "react-router-dom";
import "./ExpenseDtl.css";

function ExpenseDtl() {
  const [data, setData] = useState({
    name: "",
    cost: "",
    payment: "",
    description: "",
  });

  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState("success");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const resetForm = () => {
    setData({ name: "", cost: "", payment: "", description: "" });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/expenses/user/${userId}`,
        authHeaders
      );
      setList(res.data);
    } catch {
      handleLogout();
    }
  };

  useEffect(() => {
    if (!userId || !token) {
      navigate("/");
    } else {
      fetchExpenses();
    }
  }, []);

  const handleAdd = async () => {
    if (!data.name || !data.cost) {
      setMsg("Please fill required fields");
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/expenses`,
        { ...data, userId },
        authHeaders
      );

      setMsg("Expense added successfully");
      setSeverity("success");
      setOpen(true);

      resetForm();
      fetchExpenses();
    } catch {
      setMsg("Failed to add expense");
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleEdit = (expense) => {
    setData({
      name: expense.name,
      cost: expense.cost,
      payment: expense.payment,
      description: expense.description,
    });

    setEditId(expense._id);
    setIsEditMode(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!data.name || !data.cost) {
      setMsg("Please fill required fields");
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/expenses/${editId}`,
        { ...data, userId },
        authHeaders
      );

      setMsg("Expense updated successfully");
      setSeverity("success");
      setOpen(true);

      resetForm();
      fetchExpenses();
    } catch {
      setMsg("Failed to update expense");
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/expenses/${id}`,
        authHeaders
      );

      setMsg("Expense deleted successfully");
      setSeverity("success");
      setOpen(true);

      fetchExpenses();
    } catch {
      setMsg("Failed to delete expense");
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <div className="expense-page">
      {/* NAVBAR */}
      <AppBar
        position="static"
        className="expense-navbar"
      >
        <Toolbar className="expense-toolbar">
          <div className="expense-brand-wrap">
            <span className="brand-icon"><AccountBalanceWalletRoundedIcon /></span>
            <Typography variant="h6" className="expense-brand" sx={{ flexGrow: 1 }}>Expense Tracker</Typography>
          </div>

          <Typography variant="body1" className="expense-user">
            {userId}
          </Typography>

          <Button
            variant="contained"
            color="error"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container className="expense-content">
        <div className="expense-layout">
        {/* FORM */}
        <Box
          className="expense-card"
        >
          <div className="expense-card-heading">
            <span className="section-icon"><AddRoundedIcon /></span>
            <Typography variant="h6" className="expense-section-title">{isEditMode ? "Update Expense" : "Add Expense"}</Typography>
          </div>
          <Typography className="expense-helper">
            Keep your spending details organized in one place.
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Cost"
            value={data.cost}
            onChange={(e) => setData({ ...data, cost: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Payment"
            value={data.payment}
            onChange={(e) => setData({ ...data, payment: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={data.description}
            onChange={(e) =>
              setData({ ...data, description: e.target.value })
            }
          />

          {isEditMode ? (
            <Box className="form-actions">
              <Button
                variant="contained"
                color="warning"
                onClick={handleUpdate}
              >
                Update Expense
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <div className="form-actions"><Button variant="contained" onClick={handleAdd}>Add Expense</Button></div>
          )}
        </Box>

        {/* TABLE */}
        <Box className="expense-table-card">
          <div className="expense-table-heading">
            <div className="expense-card-heading"><span className="section-icon section-icon--blue"><ReceiptLongRoundedIcon /></span><Typography variant="h6" className="expense-section-title">Recent expenses</Typography></div>
            <span className="expense-count">{list.length} total</span>
          </div>
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {list.map((e) => (
                <TableRow key={e._id}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.cost}</TableCell>
                  <TableCell>{e.payment}</TableCell>
                  <TableCell>{e.description}</TableCell>

                  <TableCell>
                    <Box className="table-actions">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(e)}
                      >
                        Update
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(e._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow><TableCell colSpan={5} className="empty-expenses">No expenses added yet. Your saved expenses will appear here.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          </TableContainer>
        </Box>
        </div>

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

export default ExpenseDtl;

























// // ExpenseDtl.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Snackbar,
//   Alert,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./ExpenseDtl.css";

// function ExpenseDtl() {
//   const [data, setData] = useState({
//     name: "",
//     cost: "",
//     payment: "",
//     description: "",
//   });

//   const [list, setList] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [severity, setSeverity] = useState("success");

//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   const authHeaders = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const handleAuthFail = () => {
//     localStorage.setItem("isValidate", "false");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const fetchExpenses = async () => {
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/expenses/user/${userId}`,
//         authHeaders
//       );
//       setList(res.data);
//     } catch (err) {
//       if (err?.response?.status === 401 || err?.response?.status === 403) {
//         handleAuthFail();
//       } else {
//         setMsg("Failed to fetch expenses");
//         setSeverity("error");
//         setOpen(true);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!userId || !token) {
//       navigate("/");
//     } else {
//       fetchExpenses();
//     }
//   }, [userId, token]);

//   const handleAdd = async () => {
//     if (!data.name || !data.cost) {
//       setMsg("Please fill required fields");
//       setSeverity("error");
//       setOpen(true);
//       return;
//     }

//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/expenses",
//         {
//           name: data.name,
//           cost: data.cost,
//           payment: data.payment,
//           description: data.description,
//           userId: userId,
//         },
//         authHeaders
//       );

//       setMsg("Expense added");
//       setSeverity("success");
//       setOpen(true);
//       setData({ name: "", cost: "", payment: "", description: "" });
//       fetchExpenses();
//     } catch (err) {
//       if (err?.response?.status === 401 || err?.response?.status === 403) {
//         handleAuthFail();
//       } else {
//         setMsg("Failed to add expense");
//         setSeverity("error");
//         setOpen(true);
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(
//         `http://127.0.0.1:8000/expenses/${id}`,
//         authHeaders
//       );
//       setMsg("Expense deleted");
//       setSeverity("success");
//       setOpen(true);
//       fetchExpenses();
//     } catch (err) {
//       if (err?.response?.status === 401 || err?.response?.status === 403) {
//         handleAuthFail();
//       } else {
//         setMsg("Failed to delete expense");
//         setSeverity("error");
//         setOpen(true);
//       }
//     }
//   };

//   const handleLogout = () => {
//     localStorage.setItem("isValidate", "false");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div className="expense-page">
//       <Container>
//         <div className="expense-header">
//           <Typography variant="h5" className="expense-title">
//             Expense Tracker
//           </Typography>
//           <Button variant="contained" color="error" onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>

//         <Box className="expense-form">
//           <Typography variant="h6" gutterBottom>
//             Add Expense
//           </Typography>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Title"
//             value={data.name}
//             onChange={(e) => setData({ ...data, name: e.target.value })}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Cost"
//             value={data.cost}
//             onChange={(e) => setData({ ...data, cost: e.target.value })}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Payment"
//             value={data.payment}
//             onChange={(e) => setData({ ...data, payment: e.target.value })}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Description"
//             value={data.description}
//             onChange={(e) =>
//               setData({ ...data, description: e.target.value })
//             }
//           />

//           <Button
//             variant="contained"
//             className="expense-button"
//             onClick={handleAdd}
//           >
//             Add Expense
//           </Button>
//         </Box>

//         <Box className="expense-table">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Title</TableCell>
//                 <TableCell>Cost</TableCell>
//                 <TableCell>Payment</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {list.map((e) => (
//                 <TableRow key={e._id}>
//                   <TableCell>{e.name}</TableCell>
//                   <TableCell>{e.cost}</TableCell>
//                   <TableCell>{e.payment}</TableCell>
//                   <TableCell>{e.description}</TableCell>
//                   <TableCell>
//                     <Button color="error" onClick={() => handleDelete(e._id)}>
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>

//         <Snackbar
//           open={open}
//           autoHideDuration={4000}
//           onClose={() => setOpen(false)}
//         >
//           <Alert severity={severity} onClose={() => setOpen(false)}>
//             {msg}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </div>
//   );
// }

// export default ExpenseDtl;
