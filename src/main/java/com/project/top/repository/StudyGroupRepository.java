package com.project.top.repository;

import com.project.top.domain.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long>, StudyGroupRepositoryCustom {
    List<StudyGroup> findAllByCreatorId(Long creatorId);
}
