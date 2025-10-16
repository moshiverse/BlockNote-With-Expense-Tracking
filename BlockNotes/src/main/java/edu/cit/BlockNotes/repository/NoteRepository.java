package edu.cit.BlockNotes.repository;

import edu.cit.BlockNotes.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    @Query("SELECT n FROM Note n JOIN FETCH n.user WHERE n.user.id = :userId")
    List<Note> findByUserIdWithUser(Long userId);

    List<Note> findByUserId(Long userId);
}