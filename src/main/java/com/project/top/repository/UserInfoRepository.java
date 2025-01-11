package com.project.top.repository;

import com.project.top.domain.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByUserId(Long userId);

    @Query("SELECT u FROM UserInfo u JOIN FETCH  u.user WHERE u.user.id = :userId")
    Optional<UserInfo> findByUserIdWithUser(@Param("userId") Long userId);
}
