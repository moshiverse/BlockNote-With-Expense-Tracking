package edu.cit.BlockNotes.service;

import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.exceptions.ResourceNotFoundException;
import edu.cit.BlockNotes.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User createUser(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("Username already exists. Please choose another.");
        }

        user.setBalance(0.0);
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public User addFunds(Long id, Double amount) {
        User user = getUserById(id);
        user.setBalance(user.getBalance() + amount);
        return userRepository.save(user);
    }

    public User addExpense(Long id, Double expense) {
        User user = getUserById(id);
        double newBalance = user.getBalance() - expense;
        if (newBalance < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        user.setBalance(newBalance);
        return userRepository.save(user);
    }

    @Transactional
    public void clearUserData(Long id) {
        User user = getUserById(id);
        user.getNotes().clear();

        user.setBalance(0.0);
        userRepository.save(user);
    }
}