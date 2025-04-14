package com.project.top.repository;

import com.project.top.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomIdOrderBySentAtAsc(Long chatRoomId);

    @Query("select cm from ChatMessage cm " +
            "join fetch cm.sender " +
            "join fetch cm.chatRoom " +
            "where cm.id = :id")
    Optional<ChatMessage> findChatMessageWithSenderAndChatRoom(@Param("id") Long id);

    @Query("select cm from ChatMessage cm where cm.chatRoom.id = :chatRoomId " +
            "and cm.sentAt >= :cutoffDate " +
            "order by cm.sentAt desc limit :limit")
    List<ChatMessage> findRecentMessages(@Param("chatRoomId") Long chatRoomId,
                                         @Param("limit") int limit,
                                         @Param("cutoffDate") LocalDateTime cutoffDate);

    @Query("select count(m) from ChatMessage m " +
            "where m.chatRoom.id = :chatRoomId " +
            "and m.sentAt > :lastReadTime")
    Long countUnreadMessages(@Param("chatRoomId") Long chatRoomId,
                             @Param("lastReadTime") LocalDateTime lastReadTime);
}
