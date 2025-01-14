package com.project.top.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@DiscriminatorValue("STUDY_GROUP")
public class StudyGroup extends BasePost{

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    public void setStartAndEndDate(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("시작일은 종료일 이전으로 설정되어야 합니다.");
        }
        this.startDate = startDate;
        this.endDate = endDate;
    }

}
