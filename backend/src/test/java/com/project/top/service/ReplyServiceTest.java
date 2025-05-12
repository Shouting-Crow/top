package com.project.top.service;

import com.project.top.domain.Reply;
import com.project.top.dto.reply.ReplyCreateDto;
import com.project.top.dto.reply.ReplyUpdateDto;
import com.project.top.service.reply.ReplyService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

@SpringBootTest
@Rollback(false)
class ReplyServiceTest {

    @Autowired
    private ReplyService replyService;

    @Test
    void createReplyTest() {
        //7, 8번 유저와 3번 게시물(7번 유저가 생성)로 테스트 이용
        ReplyCreateDto replyCreateDto = new ReplyCreateDto();
        replyCreateDto.setBoardId(1L);
        replyCreateDto.setAuthorId(1L);
        replyCreateDto.setContent("테스트 댓글");
        replyCreateDto.setParentReplyId(null);

        Reply reply = replyService.createReply(replyCreateDto);

        ReplyCreateDto replyCreateDto2 = new ReplyCreateDto();
        replyCreateDto2.setBoardId(1L);
        replyCreateDto2.setAuthorId(1L);
        replyCreateDto2.setContent("테스트 댓글의 댓글");
        replyCreateDto2.setParentReplyId(reply.getId());

        Reply reply2 = replyService.createReply(replyCreateDto2);

        Assertions.assertNotNull(reply);
        Assertions.assertEquals("테스트 댓글", reply.getContent());
        Assertions.assertNull(reply.getParentReply());

        Assertions.assertNotNull(reply2);
        Assertions.assertEquals("테스트 댓글의 댓글", reply2.getContent());
        Assertions.assertNotNull(reply2.getParentReply());

    }

    @Test
    void updateReplyTest() {
        ReplyUpdateDto replyUpdateDto = new ReplyUpdateDto();
        replyUpdateDto.setContent("수정된 댓글");

        Reply updatedReply = replyService.updateReply(1L, 7L, replyUpdateDto);

        Assertions.assertNotNull(updatedReply);
        Assertions.assertEquals("수정된 댓글", updatedReply.getContent());
        Assertions.assertTrue(updatedReply.isEdited());
    }

    @Test
    void deleteReplyTest() {
        replyService.deleteReply(2L, 7L);
    }

}