import React, { useState, useEffect } from "react";
import axios from "axios";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ThemeProvider, CssBaseline, Button, Box } from "@mui/material";
import theme from "./theme/theme";
import ParticleBackground from "./components/NoteCard";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [page, setPage] = useState("login"); // 'login' | 'register' | 'notes'

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  useEffect(() => {
    if (user) {
      fetchNotes();
      setPage("notes");
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/notes`, {
        withCredentials: true,
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addOrUpdateNote = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newNote.trim() || !newTitle.trim()) return;

    try {
      if (isEditing && editingNote) {
        const res = await axios.put(
          `http://localhost:8080/api/notes/${editingNote.id}`,
          { title: newTitle, content: newNote },
          { withCredentials: true }
        );
        setNotes(notes.map((n) => (n.id === editingNote.id ? res.data : n)));
      } else {
        const res = await axios.post(
          `http://localhost:8080/api/notes`,
          { title: newTitle, content: newNote },
          { withCredentials: true }
        );
        setNotes([...notes, res.data]);
      }
    } catch (err) {
      console.error("Error saving note:", err);
    }

    setIsEditing(false);
    setEditingNote(null);
    setNewNote("");
    setNewTitle("");
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`, {
        withCredentials: true,
      });
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const editNote = (note) => {
    setIsEditing(true);
    setEditingNote(note);
    setNewNote(note.content);
    setNewTitle(note.title);
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        { username, password },
        { withCredentials: true }
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setPage("notes");
    } catch {
      alert("Invalid username or password");
    }
  };

  const handleRegister = async ({ username, password }) => {
    if (!username.trim() || !password.trim()) {
      alert("Please fill in both username and password.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/users/register",
        { username, password },
        { withCredentials: true }
      );
      alert("Registration successful! Please log in.");
      setPage("login");
    } catch {
      alert("Registration failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
    } catch {}
    setUser(null);
    localStorage.removeItem("user");
    setNotes([]);
    setPage("login");
  };

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const oauthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticleBackground />

      {!user ? (
        page === "register" ? (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setPage("login")}
          />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <LoginPage
              onLogin={handleLogin}
              onSwitchToRegister={() => setPage("register")}
            />

            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => oauthLogin("google")}
              >
                Login with Google
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => oauthLogin("github")}
              >
                Login with GitHub
              </Button>
            </Box>
          </Box>
        )
      ) : (
        <div className="app-root">
          <NotesPage
            notes={filteredNotes}
            onAdd={addOrUpdateNote}
            onDelete={deleteNote}
            onEdit={editNote}
            onLogout={handleLogout}
            newNote={newNote}
            setNewNote={setNewNote}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEditingNote={setEditingNote}
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
          />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
