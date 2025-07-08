package com.project.top.dto.schedule;

import com.project.top.domain.Schedule;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SchedulesDto {
    private String nickname;
    private LocalDate date;

    public static SchedulesDto schedulesFromEntity(Schedule schedule) {
        SchedulesDto schedulesDto = new SchedulesDto();
        schedulesDto.setNickname(schedule.getWriter().getNickname());
        schedulesDto.setDate(schedule.getDate());

        return schedulesDto;
    }
}
