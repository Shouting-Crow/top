package com.project.top.dto.recruitment;

import com.project.top.domain.Recruitment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class RecruitmentDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdDateTime;
    private LocalDate dueDate;
    private int currentMembers;
    private int totalMembers;
    private List<String> tags;
    private String creatorNickname;
    private String creatorContact;

    public static RecruitmentDto recruitmentFromEntity(Recruitment recruitment) {
        RecruitmentDto dto = new RecruitmentDto();
        dto.setId(recruitment.getId());
        dto.setTitle(recruitment.getTitle());
        dto.setDescription(recruitment.getDescription());
        dto.setCreatedDateTime(recruitment.getCreatedDateTime());
        dto.setDueDate(recruitment.getDueDate());
        dto.setCurrentMembers(recruitment.getCurrentMembers());
        dto.setTotalMembers(recruitment.getTotalMembers());
        dto.setTags(recruitment.getTags());
        dto.setCreatorNickname(recruitment.getCreator().getNickname());
        dto.setCreatorContact(recruitment.getCreator().getPhoneNumber());

        return dto;
    }
}
