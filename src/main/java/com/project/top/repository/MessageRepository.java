package com.project.top.repository;

import com.project.top.domain.Message;
import com.project.top.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByReceiverOrderBySentAtDesc(User receiver, Pageable pageable);
    Integer countByReceiverIdAndIsReadFalse(Long userId);
    List<Message> findTop5ByReceiverOrderBySentAtDesc(User receiver);
}
