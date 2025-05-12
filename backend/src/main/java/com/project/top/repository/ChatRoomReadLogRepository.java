package com.project.top.repository;

import com.project.top.domain.ChatRoomReadLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomReadLogRepository extends JpaRepository<ChatRoomReadLog, Long> {
    Optional<ChatRoomReadLog> findByUserIdAndChatRoomId(Long userId, Long chatRoomId);
}
