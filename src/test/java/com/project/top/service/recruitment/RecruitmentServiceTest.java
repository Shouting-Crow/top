package com.project.top.service.recruitment;

import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.RecruitmentCreateDto;
import com.project.top.dto.recruitment.RecruitmentDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentUpdateDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Rollback
@Slf4j
class RecruitmentServiceTest {

    @Autowired
    private RecruitmentService recruitmentService;

    @Test
    void recruitmentCreateTest() {
        RecruitmentCreateDto dto = new RecruitmentCreateDto();
        dto.setTitle("새 프로젝트 모집 공고");
        dto.setDescription("새 프로젝트를 모집합니다. 같이 협력할 프론트엔드 두 분을 구합니다.");
        dto.setTotalMembers(3);
        dto.setDueDate(LocalDate.of(2025, 3, 1));
        dto.setTags(List.of("HTML", "CSS", "Javascript", "React"));

        Recruitment recruitment = recruitmentService.createRecruitment(1L, dto);

        Assertions.assertNotNull(recruitment);
        Assertions.assertEquals(dto.getTitle(), "새 프로젝트 모집 공고");
        Assertions.assertEquals(dto.getTotalMembers(), 3);

        log.info("DueDate : {}", recruitment.getDueDate());
        log.info("Tags : {}", recruitment.getTags());

    }

    @Test
    void recruitmentUpdateTest() {
        RecruitmentUpdateDto dto = new RecruitmentUpdateDto();
        dto.setTitle("한 달간 열심히 해볼 팀원을 구합니다.");
        dto.setDescription("백엔드 지원자 모집");
        dto.setTotalMembers(4);
        dto.setDueDate(LocalDate.of(2025, 2, 1));
        dto.setTags(List.of("Java", "Spring", "SpringBoot"));

        Recruitment recruitment = recruitmentService.updateRecruitment(2L, 2L, dto);

        Assertions.assertNotNull(recruitment);
        Assertions.assertEquals("한 달간 열심히 해볼 팀원을 구합니다.", recruitment.getTitle());
        log.info("DueDate : {}", recruitment.getDueDate());
        log.info("Tags : {}", recruitment.getTags());
        log.info("Total Members : {}", recruitment.getTotalMembers());
    }

    @Test
    void recruitmentDeleteTest() {
        recruitmentService.deleteRecruitment(1L, 2L);

    }

    @Test
    @Transactional
    void recruitmentGetTest() {
        RecruitmentDto recruitment = recruitmentService.getRecruitment(1L);
        log.info("recruitment id : {}", recruitment.getId());
        log.info("recruitment title : {}", recruitment.getTitle());
        log.info("recruitment description : {}", recruitment.getDescription());
        log.info("recruitment current members : {}", recruitment.getCurrentMembers());
        log.info("recruitment creator nickname : {}", recruitment.getCreatorNickname());
        log.info("recruitment creator contact : {}", recruitment.getCreatorContact());

        Page<RecruitmentListDto> recruitmentList = recruitmentService.getRecruitmentList(Pageable.ofSize(2));
        for (RecruitmentListDto recruitmentListDto : recruitmentList) {
            log.info("title : {}", recruitmentListDto.getTitle());
        }
    }

}