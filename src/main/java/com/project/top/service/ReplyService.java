package com.project.top.service;

import com.project.top.domain.Reply;
import com.project.top.dto.ReplyCreateDto;
import com.project.top.dto.ReplyUpdateDto;

public interface ReplyService {
    Reply createReply(ReplyCreateDto replyCreateDto);
    Reply updateReply(Long replyId, Long userId, ReplyUpdateDto replyUpdateDto);
    void deleteReply(Long replyId, Long userId);


}
