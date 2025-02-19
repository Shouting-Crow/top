package com.project.top.repository;

import com.project.top.domain.BasePost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BasePostRepository extends JpaRepository<BasePost, Long> {
    List<BasePost> findByDueDateBeforeAndIsInactiveFalse(LocalDate now);

}
