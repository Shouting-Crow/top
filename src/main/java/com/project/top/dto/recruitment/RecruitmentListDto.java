package com.project.top.dto.recruitment;

import com.project.top.domain.Recruitment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class RecruitmentListDto {
    private Long id;
    private String title;
    private LocalDateTime dueDateTime;
    private int currentMembers;
    private int totalMembers;
    private List<String> tags;

    public static RecruitmentListDto recruitmentsFromEntity(Recruitment recruitment) {
        RecruitmentListDto dto = new RecruitmentListDto();
        dto.setId(recruitment.getId());
        dto.setTitle(recruitment.getTitle());
        dto.setDueDateTime(recruitment.getDueDateTime());
        dto.setCurrentMembers(recruitment.getCurrentMembers());
        dto.setTotalMembers(recruitment.getTotalMembers());
        dto.setTags(recruitment.getTags());

        return dto;
    }
}
