package edu.cit.BlockNotes.service;

import edu.cit.BlockNotes.entity.Note;
import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.repository.NoteRepository;
import edu.cit.BlockNotes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<Note> getNotesByUser(String userId) {
        return noteRepository.findByUserId(userId);
    }

    public Note createNote(String userId, Note note) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String customId = user.getUsername() + "-note-" + UUID.randomUUID();
        note.setId(customId);
        note.setUser(user);

        return noteRepository.save(note);
    }

    public Note updateNote(String noteId, Note noteDetails) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setTitle(noteDetails.getTitle());
        note.setContent(noteDetails.getContent());
        return noteRepository.save(note);
    }

    public void deleteNote(String noteId) {
        noteRepository.deleteById(noteId);
    }
}