package com.project.top.service.schedule;

import com.project.top.domain.Group;
import com.project.top.domain.Schedule;
import com.project.top.domain.User;
import com.project.top.dto.schedule.*;
import com.project.top.repository.GroupMemberRepository;
import com.project.top.repository.GroupRepository;
import com.project.top.repository.ScheduleRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Override
    @Transactional
    public Long createSchedule(ScheduleCreateDto scheduleCreateDto) {
        Group group = groupRepository.findById(scheduleCreateDto.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));

        User writer = userRepository.findById(scheduleCreateDto.getWriterId())
                .orElseThrow(() -> new IllegalArgumentException("그룹의 맴버가 아니거나 사용자를 찾을 수 없습니다."));

        boolean isMember = groupMemberRepository.existsByGroupIdAndMemberId(group.getId(), writer.getId());
        if (!isMember) {
            throw new AccessDeniedException("해당 그룹의 맴버가 아닙니다.");
        }

        Schedule schedule = new Schedule();
        schedule.setGroup(group);
        schedule.setWriter(writer);
        schedule.setDate(scheduleCreateDto.getDate());
        schedule.setContent(scheduleCreateDto.getContent());

        return scheduleRepository.save(schedule).getId();
    }

    @Override
    public List<ScheduleDetailDto> getSchedulesOnDetail(Long groupId, LocalDate date) {
        List<Schedule> schedules = scheduleRepository.findSchedulesByGroupIdAndDateOrderByCreatedAtAsc(groupId, date);

        return schedules.stream()
                .map(ScheduleDetailDto::schedulesFromEntity)
                .toList();
    }

    @Override
    public List<SchedulesDto> getSchedules(Long groupId) {
        List<Schedule> schedules = scheduleRepository.findByGroupIdOrderByDateAsc(groupId);

        return schedules.stream()
                .map(SchedulesDto::schedulesFromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void updateSchedule(ScheduleUpdateDto scheduleUpdateDto) {
        Schedule schedule = scheduleRepository.findByGroupIdAndWriterIdAndDate(
                        scheduleUpdateDto.getGroupId(),
                        scheduleUpdateDto.getWriterId(),
                        scheduleUpdateDto.getDate())
                .orElseThrow(() -> new IllegalArgumentException("수정할 일정을 찾을 수 업습니다."));

        schedule.setContent(scheduleUpdateDto.getContent());
    }

    @Override
    @Transactional
    public void deleteSchedule(ScheduleDeleteDto scheduleDeleteDto) {
        scheduleRepository.deleteByGroupIdAndWriterIdAndDate(scheduleDeleteDto.getGroupId(),
                scheduleDeleteDto.getWriterId(),
                scheduleDeleteDto.getDate());
    }
}
