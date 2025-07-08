package com.project.top.repository;

import com.project.top.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findSchedulesByGroupIdAndDateOrderByCreatedAtAsc(Long groupId, LocalDate date);
    List<Schedule> findByGroupIdOrderByDateAsc(Long groupId);
    Optional<Schedule> findByGroupIdAndWriterIdAndDate(Long groupId, Long writerId, LocalDate date);
    void deleteByGroupIdAndWriterIdAndDate(Long groupId, Long writerId, LocalDate date);
}
