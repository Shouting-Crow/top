package com.project.top.repository;

import com.project.top.domain.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    Page<Reply> findByBoardIdOrderByCreatedAtAsc(Long boardId, Pageable pageable);
}
