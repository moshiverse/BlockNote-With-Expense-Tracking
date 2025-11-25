import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function NotesPage({
  notes,
  onAdd,
  onDelete,
  onEdit,
  onLogout,
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  newAmount,
  setNewAmount,
  newType,
  setNewType,
  isEditing,
  setIsEditing,
  setEditingNote,
  search,
  setSearch,
  userBalance,
  onAddFunds,
  onClearAll,
  username,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [addFundsDialog, setAddFundsDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  const openAddDialog = () => {
    setIsEditing(false);
    setEditingNote(null);
    setNewTitle("");
    setNewContent("");
    setNewAmount(0);
    setNewType("note");
    setOpenDialog(true);
  };

  const openEditDialog = (note, e) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewAmount(note.amount || 0);
    setNewType(note.type || "note");
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingNote(null);
  };

  const saveNote = async (e) => {
    await onAdd(e);
    closeDialog();
  };

  const filteredNotes = notes
    .filter((n) => (filterType === "all" ? true : n.type === filterType))
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: 4, px: { xs: 2, sm: 4, md: 6, lg: 6 } }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Welcome, {username}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Balance: ₱{userBalance?.toFixed(2) || "0.00"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            placeholder="Search notes..."
            sx={{ minWidth: 180 }}
          />
          <IconButton onClick={openAddDialog} color="primary" sx={{ width: 48, height: 48 }}>
            <AddIcon fontSize="large" />
          </IconButton>
          <Button variant="addFunds" color="success" onClick={() => setAddFundsDialog(true)}>
            Add Funds
          </Button>
          <Button variant="resetAll" color="error" onClick={() => setConfirmDialogOpen(true)}>
            Reset All
          </Button>
          <Button variant="logout" color="secondary" onClick={() => setLogoutConfirmOpen(true)}>
            Logout
          </Button>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="note">Notes</MenuItem>
            <MenuItem value="expense">Expenses</MenuItem>
          </Select>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* MAIN SPLIT LAYOUT */}
      <Grid container spacing={4} columnSpacing={6} sx={{ mt: 2 }}>
        
        {/* LEFT — NOTES */}
        <Grid item xs={12} md={6} sx={{ pr: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Notes
          </Typography>

          {filteredNotes.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 1 }}>
              No notes match the filter. Click the "+" button to create one.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredNotes.map((note) => (
                <Grid key={note.id} item>
                  <Paper
                    elevation={4}
                    onClick={() => setViewNote(note)}
                    sx={{
                      width: 260,
                      height: 230,
                      p: 2.5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      noWrap
                      title={note.title}
                      sx={{
                        fontWeight: 700,
                        color: note.type === "expense" ? "error.main" : "primary.main",
                      }}
                    >
                      {note.title || "Untitled"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        flexGrow: 1,
                        whiteSpace: "pre-line",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {note.content}
                    </Typography>

                    {note.type === "expense" && (
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }} color="error">
                        Expense: ₱{note.amount?.toFixed(2)}
                      </Typography>
                    )}

                    <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button size="small" variant="edit" onClick={(e) => openEditDialog(note, e)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteToDelete(note);
                          setConfirmDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* RIGHT — VISUALIZATION */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minWidth: 450,
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Data Visualization
          </Typography>

          {/* Pie Chart */}
          <Paper sx={{ p: 3, height: 350, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Expenses Breakdown
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={notes
                    .filter((n) => n.type === "expense")
                    .map((n) => ({
                      name: n.title,
                      value: n.amount,
                    }))
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {notes
                    .filter((n) => n.type === "expense")
                    .map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `₱${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Summary */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Summary
            </Typography>

            <Typography variant="body1">
              Total Notes: <b>{notes.filter((n) => n.type === "note").length}</b>
            </Typography>
            <Typography variant="body1">
              Total Expenses: <b>{notes.filter((n) => n.type === "expense").length}</b>
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
              Total Spent:{" "}
              <b>
                ₱
                {notes
                  .filter((n) => n.type === "expense")
                  .reduce((acc, n) => acc + (n.amount || 0), 0)
                  .toFixed(2)}
              </b>
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
              Current Balance: <b>₱{userBalance?.toFixed(2)}</b>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* --- DIALOGS (unchanged) --- */}

      {/* View Dialog */}
      <Dialog open={!!viewNote} onClose={() => setViewNote(null)} fullWidth maxWidth="md">
        <DialogTitle>{viewNote?.title || "Untitled"}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {viewNote?.content}
          </Typography>
          {viewNote?.type === "expense" && (
            <Typography variant="subtitle1" color="error" sx={{ mt: 2 }}>
              Expense: ₱{viewNote.amount?.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewNote(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit Entry" : "New Entry"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            minRows={4}
            margin="dense"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />

          <Select
            fullWidth
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="note">Note</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>

          {newType === "expense" && (
            <TextField
              label="Amount"
              type="number"
              fullWidth
              margin="dense"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveNote}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Funds Dialog */}
      <Dialog open={addFundsDialog} onClose={() => setAddFundsDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="dense"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFundsDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={() => {
            onAddFunds(parseFloat(fundAmount) || 0);
            setAddFundsDialog(false);
          }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Reset */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Reset all notes and clear your balance?  
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => {
            onClearAll();
            setConfirmDialogOpen(false);
          }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Delete "{noteToDelete?.title}"?  
            This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => {
            onDelete(noteToDelete.id);
            setConfirmDeleteOpen(false);
          }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Logout */}
      <Dialog open={logoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={onLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NotesPage;
