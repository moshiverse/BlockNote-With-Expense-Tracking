import React from "react";
import { Paper, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function NoteList({ notes, onDelete, onEdit, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="notes" direction="horizontal">
        {(provided) => (
          <Box
            sx={{ display: "flex", gap: 2, overflowX: "auto", p: 1, width: "100%" }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {notes.slice().reverse().map((note, index) => (
              <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    elevation={6}
                    sx={{ minWidth: 250, p: 2, flexShrink: 0 }}
                  >
                    <Typography variant="h6">{note.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{note.content}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                      <IconButton color="primary" onClick={() => onEdit(note)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete(note.id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default NoteList;
