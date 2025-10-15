package edu.cit.BlockNotes.controller;

import edu.cit.BlockNotes.entity.Note;
import edu.cit.BlockNotes.service.NoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    private final NoteService noteService;
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/user/{userId}")
    public List<Note> getNotesByUser(@PathVariable String userId) {
        return noteService.getNotesByUser(userId);
    }

    @PostMapping("/user/{userId}")
    public Note createNote(@PathVariable String userId, @RequestBody Note note) {
        return noteService.createNote(userId, note);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable String id, @RequestBody Note note) {
        return noteService.updateNote(id, note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
    }
}
