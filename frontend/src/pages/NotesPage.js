import React, { useState } from "react";
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
  sort,
  setSort,
  userBalance,
  onAddFunds,
  onClearAll,   // ✅ added this line
  userId,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [addFundsDialog, setAddFundsDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const openAdd = () => {
    setIsEditing(false);
    setEditingNote(null);
    setNewTitle("");
    setNewContent("");
    setNewAmount(0.0);
    setNewType("note");
    setOpenDialog(true);
  };

  const openEdit = (note, e) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewAmount(note.amount || 0.0);
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

  const openView = (note) => setViewNote(note);
  const closeView = () => setViewNote(null);

  const handleAddFundsClick = () => {
    setFundAmount("");
    setAddFundsDialog(true);
  };

  const handleAddFundsConfirm = async () => {
    await onAddFunds(parseFloat(fundAmount) || 0);
    setAddFundsDialog(false);
  };

const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

const handleClearAll = async () => {
      setConfirmDialogOpen(true);
    };

const handleConfirmClear = async () => {
      await onClearAll();
      setConfirmDialogOpen(false);
    };

const handleCancelClear = () => {
      setConfirmDialogOpen(false);
    };

const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [noteToDelete, setNoteToDelete] = useState(null);

const handleConfirmDelete = async () => {
  if (noteToDelete) {
    await onDelete(noteToDelete.id);
    setNoteToDelete(null);
    setConfirmDeleteOpen(false);
  }
};

const handleCancelDelete = () => {
  setNoteToDelete(null);
  setConfirmDeleteOpen(false);
};

const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);




  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 4, px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
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
            BlockNotes
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Balance: ₱{userBalance?.toFixed(2) || "0.00"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} size="small" sx={{ minWidth: 140 }}>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="expense">Notes</MenuItem>
            <MenuItem value="note">Expenses</MenuItem> 
          </Select>

          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            placeholder="Search notes..."
            sx={{ minWidth: 180 }}
          />

          <IconButton onClick={openAdd} color="primary" sx={{ width: 48, height: 48 }}>
            <AddIcon fontSize="large" />
          </IconButton>

          <Button variant="addFunds" color="success" onClick={handleAddFundsClick}>
            Add Funds
          </Button>

          <Button variant="resetAll" color="error" onClick={handleClearAll}>
            Reset All
          </Button>

          <Button
            variant="logout"
            color="secondary"
            onClick={() => setLogoutConfirmOpen(true)}
            sx={{ ml: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={4} justifyContent="flex-start">
        {notes.length === 0 ? (
          <Typography variant="body1" sx={{ ml: 2, mt: 1 }}>
            No notes yet. Click the "+" button to create one.
          </Typography>
        ) : (
          notes.map((note) => (
            <Grid key={note.id} item>
              <Paper
                elevation={4}
                onClick={() => openView(note)}
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
                  <Typography variant="subtitle2" color="error" sx={{ fontWeight: 600, mt: 1 }}>
                    Expense: ₱{note.amount?.toFixed(2)}
                  </Typography>
                )}

                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button size="small" variant="edit" onClick={(e) => openEdit(note, e)}>
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
          ))
        )}
      </Grid>

      {/* View Dialog */}
      <Dialog open={!!viewNote} onClose={closeView} fullWidth maxWidth="md">
        <DialogTitle>{viewNote?.title || "Untitled"}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {viewNote?.content}
          </Typography>
          {viewNote?.type === "expense" && (
            <Typography variant="subtitle1" sx={{ mt: 2 }} color="error">
              Expense: ₱{viewNote.amount?.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit Entry" : "New Entry"}</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <TextField
            label="Content"
            fullWidth
            multiline
            minRows={4}
            margin="dense"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <Select fullWidth value={newType} onChange={(e) => setNewType(e.target.value)} margin="dense" sx={{ mt: 2 }}>
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
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFundsDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleAddFundsConfirm}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Clear Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelClear} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Reset all notes and clear your balance? <br /> <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear}>Cancel</Button>
          <Button onClick={handleConfirmClear} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Are you sure you want to delete "{noteToDelete?.title}"? <br /> <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="deleteop">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to logout? You will need to log in again to access your notes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              onLogout(); // Call the App’s logout handler
              setLogoutConfirmOpen(false);
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default NotesPage;
