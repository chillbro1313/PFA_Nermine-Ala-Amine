package com.example.ecomback.dto;

import com.example.ecomback.entity.Role;

public class AuthenticationResponse {

    private String token;
    private String name;
    private String email;
    private Role role;

    // No-arg constructor
    public AuthenticationResponse() {}

    // All-args constructor
    public AuthenticationResponse(String token, String name, String email, Role role) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String name;
        private String email;
        private Role role;

        public Builder token(String token) { this.token = token; return this; }
        public Builder name(String name)   { this.name = name;   return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(Role role)     { this.role = role;   return this; }
        public AuthenticationResponse build() { return new AuthenticationResponse(token, name, email, role); }
    }

    // Getters
    public String getToken() { return token; }
    public String getName()  { return name; }
    public String getEmail() { return email; }
    public Role getRole()    { return role; }

    // Setters
    public void setToken(String token) { this.token = token; }
    public void setName(String name)   { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Role role)     { this.role = role; }
}
