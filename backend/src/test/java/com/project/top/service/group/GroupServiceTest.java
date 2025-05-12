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

//    @Test
//    void createGroupTest() {
//        GroupCreateDto dto = new GroupCreateDto();
//        dto.setName("프론트엔드 프로젝트를 진행하고 배포까지 진행하는 프로젝트");
//        dto.setDescription("열심히 하지 않는다고 판단되면 퇴장이 불가피합니다.");
//        dto.setType(GroupType.PROJECT);
//        dto.setBasePostId(1L);
//
//        GroupDto groupDto = groupService.createGroup(1L, dto);
//
//        Assertions.assertNotNull(groupDto);
//    }
//
//    @Test
//    void deleteGroupTest() {
//        groupService.deleteGroup(1L, 1L);
//    }

}