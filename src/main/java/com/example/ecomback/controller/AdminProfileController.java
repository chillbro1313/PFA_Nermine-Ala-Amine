package com.example.ecomback.controller;

import com.example.ecomback.dto.UserDTO;
import com.example.ecomback.entity.User;
import com.example.ecomback.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/profile")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<UserDTO> getAdminProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Admin not found"));
        return ResponseEntity.ok(UserDTO.fromEntity(admin));
    }

    @PutMapping
    public ResponseEntity<UserDTO> updateAdminProfile(@RequestBody Map<String, String> updates) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Admin not found"));

        if (updates.containsKey("name")) {
            admin.setName(updates.get("name"));
        }
        // Email change is intentionally excluded to prevent JWT invalidation
        if (updates.containsKey("password") && !updates.get("password").isEmpty()) {
            admin.setPassword(passwordEncoder.encode(updates.get("password")));
        }

        userRepository.save(admin);
        return ResponseEntity.ok(UserDTO.fromEntity(admin));
    }
}
