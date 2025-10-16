package edu.cit.BlockNotes.service;

import edu.cit.BlockNotes.dto.NoteDTO;
import edu.cit.BlockNotes.entity.Note;
import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.exceptions.InsufficientFundsException;
import edu.cit.BlockNotes.exceptions.ResourceNotFoundException;
import edu.cit.BlockNotes.repository.NoteRepository;
import edu.cit.BlockNotes.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<NoteDTO> getNotesByUserId(Long userId) {
        return noteRepository.findByUserIdWithUser(userId).stream()
                .map(NoteDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoteDTO addNoteForUser(Long userId, Note note) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        note.setUser(user);

        if ("expense".equalsIgnoreCase(note.getType()) && note.getAmount() != null && note.getAmount() > 0) {
            if (user.getBalance() < note.getAmount()) {
                throw new InsufficientFundsException("Insufficient funds to add this expense.");
            }
            user.setBalance(user.getBalance() - note.getAmount());
        }
        Note savedNote = noteRepository.save(note);
        return NoteDTO.fromEntity(savedNote);
    }

    @Transactional
    public NoteDTO updateNote(Long noteId, Note updatedNoteDetails) {
        Note existingNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + noteId));

        User user = existingNote.getUser();
        double originalAmount = ("expense".equalsIgnoreCase(existingNote.getType()) && existingNote.getAmount() != null)
                ? existingNote.getAmount() : 0.0;
        double newAmount = ("expense".equalsIgnoreCase(updatedNoteDetails.getType()) && updatedNoteDetails.getAmount() != null)
                ? updatedNoteDetails.getAmount() : 0.0;
        double balanceAdjustment = newAmount - originalAmount;

        if (balanceAdjustment > 0 && user.getBalance() < balanceAdjustment) {
            throw new InsufficientFundsException("Insufficient funds to cover the increased expense amount.");
        }
        user.setBalance(user.getBalance() - balanceAdjustment);

        existingNote.setTitle(updatedNoteDetails.getTitle());
        existingNote.setContent(updatedNoteDetails.getContent());
        existingNote.setType(updatedNoteDetails.getType());
        existingNote.setAmount(updatedNoteDetails.getAmount());

        Note savedNote = noteRepository.save(existingNote);
        return NoteDTO.fromEntity(savedNote);
    }

    @Transactional
    public void deleteNote(Long noteId) {
        if (!noteRepository.existsById(noteId)) {
            throw new ResourceNotFoundException("Note not found with id: " + noteId);
        }
        noteRepository.deleteById(noteId);
    }
}