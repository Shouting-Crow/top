package com.project.top.dto.recruitment;

import com.project.top.domain.Recruitment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecruitmentListDto {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private int currentMembers;
    private int totalMembers;
    private List<String> tags;
    private String creatorNickname;
    private boolean isInactive;

    public static RecruitmentListDto recruitmentsFromEntity(Recruitment recruitment) {
        RecruitmentListDto dto = new RecruitmentListDto();
        dto.setId(recruitment.getId());
        dto.setTitle(recruitment.getTitle());
        dto.setDueDate(recruitment.getDueDate());
        dto.setCreatedAt(recruitment.getCreatedDateTime());
        dto.setCurrentMembers(recruitment.getCurrentMembers());
        dto.setTotalMembers(recruitment.getTotalMembers());
        dto.setTags(recruitment.getTags());
        dto.setCreatorNickname(recruitment.getCreator().getNickname());
        dto.setInactive(recruitment.isInactive());

        return dto;
    }
}
