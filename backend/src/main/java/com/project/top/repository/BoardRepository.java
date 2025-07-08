package com.project.top.repository;

import com.project.top.domain.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long>, BoardRepositoryCustom {
    Page<Board> findByAuthorId(Long id, Pageable pageable);
    List<Board> findTop5ByOrderByViewsDescCreatedAtDesc();
}
