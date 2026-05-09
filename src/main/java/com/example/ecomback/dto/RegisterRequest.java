package com.example.ecomback.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    // No-arg constructor
    public RegisterRequest() {}

    // All-args constructor
    public RegisterRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String email;
        private String password;

        public Builder name(String name)         { this.name = name;         return this; }
        public Builder email(String email)       { this.email = email;       return this; }
        public Builder password(String password) { this.password = password; return this; }
        public RegisterRequest build()           { return new RegisterRequest(name, email, password); }
    }

    // Getters
    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }

    // Setters
    public void setName(String name)         { this.name = name; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
