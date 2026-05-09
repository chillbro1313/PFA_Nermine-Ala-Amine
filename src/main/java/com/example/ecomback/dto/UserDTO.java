package com.example.ecomback.dto;

import com.example.ecomback.entity.Role;

public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Static factory method from entity
    public static UserDTO fromEntity(com.example.ecomback.entity.User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Role role) { this.role = role; }
}
