package edu.cit.BlockNotes.controller;

import edu.cit.BlockNotes.dto.NoteDTO;
import edu.cit.BlockNotes.entity.Note;
import edu.cit.BlockNotes.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    private final NoteService noteService;

    public NotesController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NoteDTO>> getNotesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(noteService.getNotesByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<NoteDTO> addNote(@PathVariable Long userId, @RequestBody Note note) {
        return ResponseEntity.ok(noteService.addNoteForUser(userId, note));
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<NoteDTO> updateNote(@PathVariable Long noteId, @RequestBody Note updatedNote) {
        return ResponseEntity.ok(noteService.updateNote(noteId, updatedNote));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long noteId) {
        noteService.deleteNote(noteId);
        return ResponseEntity.noContent().build();
    }
}