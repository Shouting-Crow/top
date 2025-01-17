package com.project.top.service.group;

import com.project.top.domain.GroupType;
import com.project.top.dto.group.GroupCreateDto;
import com.project.top.dto.group.GroupDto;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback(value = false)
class GroupServiceTest {

    @Autowired
    private GroupService groupService;

    @Test
    void createGroupTest() {
        GroupCreateDto dto = new GroupCreateDto();
        dto.setName("반응형 화면 제작 프로젝트 그룹");
        dto.setDescription("프론트엔드 개발의 목표를 둔 프로젝트 그룹");
        dto.setType(GroupType.PROJECT);
        dto.setBasePostId(1L);

        GroupDto groupDto = groupService.createGroup(1L, dto);

        Assertions.assertNotNull(groupDto);
        Assertions.assertEquals(groupDto.getName(), "반응형 화면 제작 프로젝트 그룹");
    }

    @Test
    void deleteGroupTest() {
        groupService.deleteGroup(5L, 1L);
    }

}