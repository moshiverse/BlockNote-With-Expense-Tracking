import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ThemeProvider, CssBaseline, Snackbar, Alert } from "@mui/material";
import theme from "./theme/theme";
import ParticleBackground from "./components/NoteCard";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAmount, setNewAmount] = useState(0.0);
  const [newType, setNewType] = useState("note");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [page, setPage] = useState("login");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateUserAndStorage = useCallback((userData) => {
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    else localStorage.removeItem("user");
    setUser(userData);
  }, []);

  useEffect(() => {
    const refreshUserSession = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      if (loggedInUser?.id) {
        try {
          const res = await axios.get(`http://localhost:8080/api/users/${loggedInUser.id}`);
          updateUserAndStorage(res.data);
        } catch (err) {
          console.error(err);
          updateUserAndStorage(null);
        }
      }
      setIsAppLoading(false);
    };
    refreshUserSession();
  }, [updateUserAndStorage]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return setNotes([]);
      try {
        const res = await axios.get(`http://localhost:8080/api/notes/user/${user.id}`);
        setNotes(res.data);
      } catch (err) {
        setError("Error fetching notes. Check backend.");
        console.error(err);
      }
    };
    fetchNotes();
  }, [user?.id]);

  const fetchUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${user.id}`);
      updateUserAndStorage(res.data);
    } catch (err) {
      setError("Could not refresh user data.");
      console.error(err);
    }
  }, [user?.id, updateUserAndStorage]);

  const addOrUpdateNote = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const noteData = {
        title: newTitle,
        content: newContent,
        type: newType,
        amount: newType === "expense" ? parseFloat(newAmount) || 0.0 : null,
      };
      if (isEditing)
        await axios.put(`http://localhost:8080/api/notes/${editingNote.id}`, noteData);
      else
        await axios.post(`http://localhost:8080/api/notes/user/${user.id}`, noteData);

      setNewTitle(""); setNewContent(""); setNewAmount(0.0); setNewType("note");
      setIsEditing(false); setEditingNote(null);

      await fetchUser();
      const notesRes = await axios.get(`http://localhost:8080/api/notes/user/${user.id}`);
      setNotes(notesRes.data);
      setSuccess(isEditing ? "Entry updated successfully!" : "New entry created!");
    } catch (err) {
      setError(err.response?.data?.error || "Error saving note");
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    setError(null);
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      setNotes(notes.filter((n) => n.id !== id));
      await fetchUser();
      setSuccess("Entry deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting note");
      console.error(err);
    }
  };

  const editNote = (note) => {
    setIsEditing(true);
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewAmount(note.amount || 0.0);
    setNewType(note.type || "note");
  };

  const handleLogin = async ({ username, password }) => {
    setError(null);
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", { username, password });
      updateUserAndStorage(res.data);
      setPage("notes");
      setSuccess("Logged in successfully!");
    } catch {
      setError("Invalid username or password");
    }
  };

  const handleRegister = async ({ username, password }) => {
    setError(null);
    try {
      await axios.post("http://localhost:8080/api/users", { username, password });
      setPage("login");
      setSuccess("Registration successful! Please log in.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      console.error(err);
    }
  };

  const handleAddFunds = async (amount) => {
    setError(null);
    try {
      const res = await axios.post(`http://localhost:8080/api/users/${user.id}/add-funds`, { amount });
      updateUserAndStorage(res.data);
      setSuccess("Funds added successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Error adding funds.");
    }
  };

  const handleClearAll = async () => {
    setError(null);
    try {
      await axios.post(`http://localhost:8080/api/users/${user.id}/clear-all`);
      updateUserAndStorage({ ...user, balance: 0 });
      setNotes([]);
      setSuccess("All data cleared successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Error clearing data.");
    }
  };

  const handleLogout = useCallback(() => {
    updateUserAndStorage(null);
    setPage("login");
    setSuccess("Logged out successfully!");
  }, [updateUserAndStorage]);

  const filteredNotes = React.useMemo(
    () =>
      notes
        .filter(
          (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
          sort === "title"
            ? a.title.localeCompare(b.title)
            : new Date(b.createdAt) - new Date(a.createdAt)
        ),
    [notes, search, sort]
  );

  if (isAppLoading) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticleBackground />

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled">{error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled">{success}</Alert>
      </Snackbar>

      {!user ? (
        page === "register" ? (
          <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setPage("login")} />
        ) : (
          <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setPage("register")} />
        )
      ) : (
        <NotesPage
          notes={filteredNotes}
          onAdd={addOrUpdateNote}
          onDelete={deleteNote}
          onEdit={editNote}
          onLogout={handleLogout}
          onAddFunds={handleAddFunds}
          onClearAll={handleClearAll} 
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newContent={newContent}
          setNewContent={setNewContent}
          newAmount={newAmount}
          setNewAmount={setNewAmount}
          newType={newType}
          setNewType={setNewType}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setEditingNote={setEditingNote}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          userBalance={user.balance}
          userId={user.id}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
