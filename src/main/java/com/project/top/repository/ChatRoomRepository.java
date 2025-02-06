package com.project.top.repository;

import com.project.top.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<List<ChatRoom>> findByGroupMembersMemberId(Long userId);

    @Query("select cr from ChatRoom cr " +
            "join fetch cr.group g " +
            "join fetch g.members m " +
            "where cr.id = :chatRoomId")
    Optional<ChatRoom> findChatRoomWithGroupAndMembers(@Param("chatRoomId") Long chatRoomId);
}
