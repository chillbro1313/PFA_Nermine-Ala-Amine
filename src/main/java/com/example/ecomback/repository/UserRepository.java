package com.example.ecomback.repository;

import com.example.ecomback.entity.Role;
import com.example.ecomback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
    List<User> findByActiveTrue();
    Page<User> findByActiveTrue(Pageable pageable);
    long countByActiveTrue();
}
