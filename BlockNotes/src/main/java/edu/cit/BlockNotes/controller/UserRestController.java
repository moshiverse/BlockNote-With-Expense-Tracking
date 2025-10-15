package edu.cit.BlockNotes.controller;

import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}", allowCredentials = "true")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("username");
        String password = body.get("password");
        return ResponseEntity.ok(userService.register(email, password));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("username");
        String password = body.get("password");
        return ResponseEntity.ok(userService.login(email, password));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null)
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(Map.of("email", email));
    }
}
