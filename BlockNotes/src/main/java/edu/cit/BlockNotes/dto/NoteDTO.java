package edu.cit.BlockNotes.dto;

import edu.cit.BlockNotes.entity.Note;
import java.time.LocalDateTime;

public record NoteDTO(
        Long id,
        String title,
        String content,
        String type,
        Double amount,
        LocalDateTime createdAt,
        String username
) {
    public static NoteDTO fromEntity(Note note) {
        return new NoteDTO(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getType(),
                note.getAmount(),
                note.getCreatedAt(),
                note.getUser() != null ? note.getUser().getUsername() : null
        );
    }
}