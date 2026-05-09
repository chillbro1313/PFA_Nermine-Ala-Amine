package com.example.ecomback.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active = true;

    // ── No-arg constructor required by JPA ──────────────────────────────────
    public User() {}

    // ── All-args constructor ─────────────────────────────────────────────────
    public User(Long id, String name, String email, String password, Role role, boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
    }

    // ── Builder ──────────────────────────────────────────────────────────────
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private Role role;
        private boolean active = true;

        public Builder id(Long id)             { this.id = id;           return this; }
        public Builder name(String name)       { this.name = name;       return this; }
        public Builder email(String email)     { this.email = email;     return this; }
        public Builder password(String pwd)    { this.password = pwd;    return this; }
        public Builder role(Role role)         { this.role = role;       return this; }
        public Builder active(boolean active)  { this.active = active;   return this; }

        public User build() {
            return new User(id, name, email, password, role, active);
        }
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    public Long getId()       { return id; }
    public String getName()   { return name; }
    public String getEmail()  { return email; }
    public Role getRole()     { return role; }
    public boolean isActive() { return active; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id)           { this.id = id; }
    public void setName(String name)     { this.name = name; }
    public void setEmail(String email)   { this.email = email; }
    public void setPassword(String pwd)  { this.password = pwd; }
    public void setRole(Role role)       { this.role = role; }
    public void setActive(boolean active){ this.active = active; }

    // ── UserDetails interface ─────────────────────────────────────────────────
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
