package com.project.top.service.schedule;

import com.project.top.dto.schedule.*;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    Long createSchedule(ScheduleCreateDto scheduleCreateDto);
    List<ScheduleDetailDto> getSchedulesOnDetail(Long groupId, LocalDate date);
    List<SchedulesDto> getSchedules(Long groupId);
    void updateSchedule(ScheduleUpdateDto scheduleUpdateDto);
    void deleteSchedule(ScheduleDeleteDto scheduleDeleteDto);
}
