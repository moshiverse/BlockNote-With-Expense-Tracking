package edu.cit.BlockNotes.controller;

import edu.cit.BlockNotes.entity.Note;
import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.repository.UserRepository;
import edu.cit.BlockNotes.service.NoteService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}", allowCredentials = "true")
public class NoteController {

    private final NoteService noteService;
    private final UserRepository userRepository;

    public NoteController(NoteService noteService, UserRepository userRepository) {
        this.noteService = noteService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Note> getMyNotes(@AuthenticationPrincipal OAuth2User principal) {
        User user = getCurrentUser(principal);
        return noteService.getNotesByUser(user.getId());
    }

    @PostMapping
    public Note createNote(@AuthenticationPrincipal OAuth2User principal, @RequestBody Note note) {
        User user = getCurrentUser(principal);
        return noteService.createNote(user.getId(), note);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) {
        return noteService.updateNote(id, note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
    }

    private User getCurrentUser(OAuth2User principal) {
        if (principal == null) throw new RuntimeException("Not authenticated");
        String email = principal.getAttribute("email");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
