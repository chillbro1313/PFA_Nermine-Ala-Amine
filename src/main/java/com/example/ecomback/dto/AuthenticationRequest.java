package com.example.ecomback.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthenticationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // No-arg constructor
    public AuthenticationRequest() {}

    // All-args constructor
    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String email;
        private String password;

        public Builder email(String email)       { this.email = email;       return this; }
        public Builder password(String password) { this.password = password; return this; }
        public AuthenticationRequest build()     { return new AuthenticationRequest(email, password); }
    }

    // Getters
    public String getEmail()    { return email; }
    public String getPassword() { return password; }

    // Setters
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
