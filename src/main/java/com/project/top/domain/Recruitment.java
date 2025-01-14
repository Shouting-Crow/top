package com.project.top.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@DiscriminatorValue("RECRUITMENT")
public class Recruitment extends BasePost{

    @Column(nullable = false)
    private LocalDateTime createdDateTime;

    @Column(nullable = false)
    private LocalDate dueDate;

    @ElementCollection
    @CollectionTable(name = "recruitment_tags", joinColumns = @JoinColumn(name = "recruitment_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    public void setDueDate(LocalDate dueDate) {
        if (dueDate.isBefore(createdDateTime.toLocalDate())){
            throw new IllegalArgumentException("마감일은 생성일 이후로 설정해야 합니다.");
        }
        this.dueDate = dueDate;
    }

}
