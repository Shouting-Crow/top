package com.project.top.repository;

import com.project.top.domain.*;
import com.project.top.dto.board.BoardListDto;
import com.project.top.dto.board.BoardSearchDto;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<BoardListDto> searchBoards(BoardSearchDto boardSearchDto, Pageable pageable) {
        QBoard board = QBoard.board;
        QUser user = QUser.user;
        QCategory category = QCategory.category;

        BooleanBuilder builder = new BooleanBuilder();

        if (StringUtils.hasText(boardSearchDto.getKeyword())) {
            String keyword = boardSearchDto.getKeyword();
            String searchType = boardSearchDto.getSearchType();

            switch (searchType) {
                case "title" -> builder.and(board.title.like("%" + keyword + "%"));
                case "author" -> builder.and(board.author.nickname.like("%" + keyword + "%"));
                case "content" -> builder.and(board.content.like("%" + keyword + "%"));
                case "all" -> builder.andAnyOf(
                        board.title.like("%" + keyword + "%"),
                        board.author.nickname.like("%" + keyword + "%"),
                        board.content.like("%" + keyword + "%")
                );
            }
        }

        if (StringUtils.hasText(boardSearchDto.getBoardType()) &&
            !boardSearchDto.getBoardType().equalsIgnoreCase("all")) {
            builder.and(board.category.name.eq(boardSearchDto.getBoardType()));
        }

        JPAQuery<Board> query = queryFactory
                .selectFrom(board)
                .leftJoin(board.author, user)
                .leftJoin(board.category, category)
                .where(builder)
                .orderBy(board.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        long totalCount = queryFactory
                .select(board.count())
                .from(board)
                .leftJoin(board.author, user)
                .leftJoin(board.category, category)
                .where(builder)
                .fetchOne();

        System.out.println("백엔드 TotalCount : " + totalCount);

        List<Board> boards = query.fetch();

        List<BoardListDto> results = boards.stream()
                .map(BoardListDto::fromEntity)
                .toList();

        return new PageImpl<>(results, pageable, totalCount);
    }
}
