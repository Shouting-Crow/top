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

    @ElementCollection
    @CollectionTable(name = "recruitment_tags", joinColumns = @JoinColumn(name = "recruitment_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

}
