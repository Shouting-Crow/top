package com.project.top.dto.schedule;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ScheduleCreateDto {
    private Long groupId;
    private Long writerId;
    private String content;
    private LocalDate date;
}
