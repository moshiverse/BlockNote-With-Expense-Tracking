import React from "react";
import { TextField, Button, Box } from "@mui/material";

function NoteForm({ title, onTitleChange, value, onChange, onSubmit, isEditing, onCancel }) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        mb: 5,
      }}
    >
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={onTitleChange}
        placeholder="Enter note title"
      />
      <TextField
        label="Write a note..."
        fullWidth
        multiline
        minRows={4}
        maxRows={10}
        value={value}
        onChange={onChange}
        placeholder="Enter your note here..."
      />
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-start" }}>
        {isEditing && (
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? "Update" : "Add"}
        </Button>
      </Box>
    </Box>
  );
}

export default NoteForm;
