package com.project.top.dto.studyGroup;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudyGroupUpdateDto {
    private String title;
    private String description;
    private int totalMembers;
    private String topic;
    private LocalDate startDate;
    private LocalDate endDate;
}
