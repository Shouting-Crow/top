package com.project.top.dto.schedule;

import com.project.top.domain.Schedule;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleDetailDto {
    private Long writerId;
    private String nickname;
    private LocalDateTime createdAt;
    private String content;

    public static ScheduleDetailDto schedulesFromEntity(Schedule schedule) {
        ScheduleDetailDto dto = new ScheduleDetailDto();
        dto.setWriterId(schedule.getWriter().getId());
        dto.setNickname(schedule.getWriter().getNickname());
        dto.setCreatedAt(schedule.getCreatedAt());
        dto.setContent(schedule.getContent());

        return dto;
    }
}
