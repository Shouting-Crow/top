package com.project.top.repository;

import com.project.top.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);
    Optional<User> findByNickname(String nickname);

    boolean existsByEmail(String email);

    List<User> findByEmail(String email);
}
