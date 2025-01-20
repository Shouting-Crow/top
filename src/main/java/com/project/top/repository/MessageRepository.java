package com.project.top.repository;

import com.project.top.domain.Message;
import com.project.top.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverOrderBySentAtDesc(User receiver);
    Integer countByReceiverIdAndIsReadFalse(Long userId);
    List<Message> findTop5ByReceiverOrderBySentAtDesc(User receiver);
}
