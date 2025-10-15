package edu.cit.BlockNotes.service;

import edu.cit.BlockNotes.entity.User;
import edu.cit.BlockNotes.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());

        String email = attributes.get("email") != null ? String.valueOf(attributes.get("email"))
                : "user_" + System.currentTimeMillis() + "@no-email.local";

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setDisplayName(String.valueOf(attributes.getOrDefault("name", email)));
            return userRepository.save(u);
        });

        Map<String, Object> principalAttrs = new HashMap<>();
        principalAttrs.put("email", user.getEmail());
        principalAttrs.put("displayName", user.getDisplayName());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                principalAttrs,
                "email"
        );
    }
}
