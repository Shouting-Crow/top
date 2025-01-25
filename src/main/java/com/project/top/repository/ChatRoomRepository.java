package com.project.top.repository;

import com.project.top.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<List<ChatRoom>> findByGroupMembersMemberId(Long userId);
}
