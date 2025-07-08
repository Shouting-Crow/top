package com.project.top.dto.schedule;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ScheduleDeleteDto {
    private Long groupId;
    private Long writerId;
    private LocalDate date;
}
