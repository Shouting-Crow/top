package com.project.top.service.reply;

import com.project.top.domain.Reply;
import com.project.top.dto.reply.ReplyCreateDto;
import com.project.top.dto.reply.ReplyDto;
import com.project.top.dto.reply.ReplyUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReplyService {
    Reply createReply(ReplyCreateDto replyCreateDto);
    Reply updateReply(Long replyId, Long userId, ReplyUpdateDto replyUpdateDto);
    void deleteReply(Long replyId, Long userId);
    Page<ReplyDto> getRepliesByBoardId(Long boardId, Pageable pageable);


}
