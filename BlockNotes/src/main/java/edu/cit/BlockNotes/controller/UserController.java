package edu.cit.BlockNotes.controller;

import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }

    @PostMapping("/{id}/add-funds")
    public ResponseEntity<User> addFunds(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount;
        try {
            Object obj = request.get("amount");
            if (obj instanceof Number) {
                amount = ((Number) obj).doubleValue();
            } else {
                amount = Double.parseDouble(obj.toString());
            }
        } catch (Exception ex) {
            throw new IllegalArgumentException("Amount must be a valid number");
        }
        User updated = userService.addFunds(id, amount);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/add-expense")
    public ResponseEntity<User> addExpense(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double expense;
        try {
            Object obj = request.get("expense");
            if (obj instanceof Number) {
                expense = ((Number) obj).doubleValue();
            } else {
                expense = Double.parseDouble(obj.toString());
            }
        } catch (Exception ex) {
            throw new IllegalArgumentException("Expense must be a valid number");
        }
        User updated = userService.addExpense(id, expense);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/clear-all")
    public ResponseEntity<String> clearAll(@PathVariable Long id) {
        userService.clearUserData(id);
        return ResponseEntity.ok("All notes cleared and balance reset to 0.");
    }
}