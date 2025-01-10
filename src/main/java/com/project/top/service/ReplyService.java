package com.project.top.service;

import com.project.top.domain.Reply;
import com.project.top.dto.ReplyCreateDto;
import com.project.top.dto.ReplyDto;
import com.project.top.dto.ReplyUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReplyService {
    Reply createReply(ReplyCreateDto replyCreateDto);
    Reply updateReply(Long replyId, Long userId, ReplyUpdateDto replyUpdateDto);
    void deleteReply(Long replyId, Long userId);
    Page<ReplyDto> getRepliesByBoardId(Long boardId, Pageable pageable);


}
