package com.project.top.service.studyGroup;

import com.project.top.domain.StudyGroup;
import com.project.top.dto.studyGroup.StudyGroupCreateDto;
import com.project.top.dto.studyGroup.StudyGroupDto;
import com.project.top.dto.studyGroup.StudyGroupUpdateDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback(false)
@Slf4j
class StudyGroupServiceTest {

    @Autowired
    private StudyGroupService studyGroupService;

    @Test
    void createStudyGroupTest() {

        StudyGroupCreateDto dto = new StudyGroupCreateDto();
        dto.setTitle("스프링 공부할 사람들을 모집합니다.");
        dto.setDescription("자바의 기초가 어느정도 잡힌 사람들을 위한 스프링 그룹 스터디.");
        dto.setTopic("Spring");
        dto.setStartDate(LocalDate.of(2025, 1, 15));
        dto.setEndDate(LocalDate.of(2025, 1, 31));
        dto.setTotalMembers(5);

        StudyGroupDto studyGroupDto = studyGroupService.createStudyGroup(2L, dto);

        Assertions.assertNotNull(studyGroupDto);
        Assertions.assertEquals(dto.getTitle(), studyGroupDto.getTitle());
        Assertions.assertEquals(dto.getDescription(), studyGroupDto.getDescription());
        Assertions.assertEquals(dto.getTopic(), studyGroupDto.getTopic());
        Assertions.assertEquals(dto.getStartDate(), studyGroupDto.getStartDate());
        Assertions.assertEquals(dto.getEndDate(), studyGroupDto.getEndDate());
        Assertions.assertEquals(dto.getTotalMembers(), studyGroupDto.getTotalMembers());

        log.info("Nickname : {}", studyGroupDto.getCreatorNickname());
        log.info("Title : {}", studyGroupDto.getTitle());
        log.info("Description : {}", studyGroupDto.getDescription());
    }

    @Test
    void updateStudyGroupTest() {
        StudyGroupUpdateDto dto = new StudyGroupUpdateDto();
        dto.setTitle("스프링 스터디 그룹");
        dto.setDescription("자바를 잘 몰라도 스프링 학습을 통해서 같이 성장해 나갈 맴버를 모집합니다.");
        dto.setTopic("토비의 스프링");
        dto.setStartDate(LocalDate.of(2025, 1, 20));
        dto.setEndDate(LocalDate.of(2025, 2, 28));
        dto.setTotalMembers(6);

        StudyGroupDto studyGroupDto = studyGroupService.updateStudyGroup(2L, 2L, dto);

        log.info("title : {}", studyGroupDto.getTitle());
        log.info("description : {}", studyGroupDto.getDescription());
        log.info("nickname : {}", studyGroupDto.getCreatorNickname());
        log.info("topic : {}", studyGroupDto.getTopic());
        log.info("duration : {}", studyGroupDto.getStartDate() + " ~ " + studyGroupDto.getEndDate());
        log.info("totalMembers : {}", studyGroupDto.getTotalMembers());
    }

    @Test
    void deleteStudyGroupTest() {
        studyGroupService.deleteStudyGroup(3L, 2L);
    }

}