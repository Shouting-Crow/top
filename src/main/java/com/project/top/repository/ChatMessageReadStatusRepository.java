package com.project.top.repository;

import com.project.top.domain.ChatMessageReadStatus;
import com.project.top.dto.chatRoom.ChatRoomUnreadCountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageReadStatusRepository extends JpaRepository<ChatMessageReadStatus, Long> {
    int countByUserIdAndIsReadFalse(Long userId);

    @Query("select new com.project.top.dto.chatRoom.ChatRoomUnreadCountDto(r.message.chatRoom.id, count(r)) " +
            "from ChatMessageReadStatus r " +
            "where r.user.id = :userId and r.isRead = false " +
            "group by r.message.chatRoom.id")
    List<ChatRoomUnreadCountDto> findUnreadMessageCountsByUserId(@Param("userId") Long userId);

}
