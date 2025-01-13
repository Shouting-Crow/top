package com.project.top.dto.recruitment;

import com.project.top.domain.Recruitment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class RecruitmentListDto {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private int currentMembers;
    private int totalMembers;
    private List<String> tags;

    public static RecruitmentListDto recruitmentsFromEntity(Recruitment recruitment) {
        RecruitmentListDto dto = new RecruitmentListDto();
        dto.setId(recruitment.getId());
        dto.setTitle(recruitment.getTitle());
        dto.setDueDate(recruitment.getDueDate());
        dto.setCurrentMembers(recruitment.getCurrentMembers());
        dto.setTotalMembers(recruitment.getTotalMembers());
        dto.setTags(recruitment.getTags());

        return dto;
    }
}
