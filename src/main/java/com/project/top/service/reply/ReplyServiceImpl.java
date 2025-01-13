package com.project.top.service.reply;

import com.project.top.domain.Board;
import com.project.top.domain.Reply;
import com.project.top.domain.User;
import com.project.top.dto.reply.ReplyCreateDto;
import com.project.top.dto.reply.ReplyDto;
import com.project.top.dto.reply.ReplyUpdateDto;
import com.project.top.repository.BoardRepository;
import com.project.top.repository.ReplyRepository;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReplyServiceImpl implements ReplyService{

    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    @Override
    @Transactional
    public Reply createReply(ReplyCreateDto replyCreateDto) {

        Board board = boardRepository.findById(replyCreateDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        User author = userRepository.findById(replyCreateDto.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("작성자가 존재하지 않습니다."));

        Reply parentReply = null;

        if (replyCreateDto.getParentReplyId() != null) {
            parentReply = replyRepository.findById(replyCreateDto.getParentReplyId())
                    .orElseThrow(() -> new IllegalArgumentException("상위 댓글이 존재하지 않습니다."));
        }

        Reply reply = new Reply();
        reply.setBoard(board);
        reply.setAuthor(author);
        reply.setContent(replyCreateDto.getContent());
        reply.setParentReply(parentReply);

        return replyRepository.save(reply);
    }

    @Override
    @Transactional
    public Reply updateReply(Long replyId, Long userId, ReplyUpdateDto replyUpdateDto) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!reply.getAuthor().getId().equals(userId)) {
            throw new SecurityException("댓글을 수정할 권한이 없습니다.");
        }

        reply.setContent(replyUpdateDto.getContent());
        reply.changeEdited();

        return replyRepository.save(reply);
    }

    @Override
    @Transactional
    public void deleteReply(Long replyId, Long userId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!reply.getAuthor().getId().equals(userId)) {
            throw new SecurityException("댓글을 삭제할 권한이 없습니다.");
        }

        replyRepository.delete(reply);
    }

    @Override
    public Page<ReplyDto> getRepliesByBoardId(Long boardId, Pageable pageable) {
        Page<Reply> replies = replyRepository.findByBoardIdOrderByCreatedAtAsc(boardId, pageable);

        return replies.map(ReplyDto::replyDtoFromEntity);
    }
}
