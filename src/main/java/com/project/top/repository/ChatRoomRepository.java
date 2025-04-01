package com.project.top.repository;

import com.project.top.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<List<ChatRoom>> findByGroupMembersMemberId(Long userId);

    @Query("select cr from ChatRoom cr " +
            "join fetch cr.group g " +
            "join fetch g.members m " +
            "where cr.id = :chatRoomId")
    Optional<ChatRoom> findChatRoomWithGroupAndMembers(@Param("chatRoomId") Long chatRoomId);

    @Query(value = "SELECT EXISTS ( " +
            "SELECT 1 FROM group_members gm " +
            "WHERE gm.group_id = (SELECT cr.group_id FROM chat_rooms cr WHERE cr.id = :chatRoomId) " +
            "AND gm.member_id = :userId)", nativeQuery = true)
    Integer isUserInChatRoom(@Param("chatRoomId") Long chatRoomId, @Param("userId") Long userId);

    Optional<ChatRoom> findByGroupId(Long groupId);
    boolean existsByGroupId(Long groupId);
}


