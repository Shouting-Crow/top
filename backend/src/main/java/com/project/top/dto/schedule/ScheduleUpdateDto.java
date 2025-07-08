package com.project.top.dto.schedule;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ScheduleUpdateDto {
    private Long groupId;
    private Long writerId;
    private String content;
    private LocalDate date;
}
