package edu.cit.BlockNotes.repository;

import edu.cit.BlockNotes.entity.Note;
import edu.cit.BlockNotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser(User user);
}
