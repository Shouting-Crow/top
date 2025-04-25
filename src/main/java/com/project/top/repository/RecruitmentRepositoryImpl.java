package com.project.top.repository;

import com.project.top.domain.QRecruitment;
import com.project.top.domain.QUser;
import com.project.top.domain.Recruitment;
import com.project.top.dto.recruitment.RecruitmentListDto;
import com.project.top.dto.recruitment.RecruitmentSearchDto;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import static com.querydsl.core.types.dsl.Expressions.stringTemplate;
import static com.querydsl.core.types.dsl.Expressions.asString;

import java.util.List;

@RequiredArgsConstructor
public class RecruitmentRepositoryImpl implements RecruitmentRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<RecruitmentListDto> searchRecruitments(RecruitmentSearchDto recruitmentSearchDto, Pageable pageable) {
        QRecruitment recruitment = QRecruitment.recruitment;
        QUser user = QUser.user;

        BooleanBuilder builder = new BooleanBuilder();

        if (StringUtils.hasText(recruitmentSearchDto.getKeyword()) && recruitmentSearchDto.getKeyword().length() >= 2) {
            String keyword = recruitmentSearchDto.getKeyword();

            switch (recruitmentSearchDto.getSearchType()) {
                case "title" ->
                        builder.and(recruitment.title.like("%" + keyword + "%"));

                case "creator" ->
                        builder.and(recruitment.creator.nickname.like("%" + keyword + "%"));

                case "content" ->
                        builder.and(recruitment.description.like("%" + keyword + "%"));

                case "all" ->
                        builder.andAnyOf(
                                recruitment.title.like("%" + keyword + "%"),
                                recruitment.creator.nickname.like("%" + keyword + "%"),
                                recruitment.description.like("%" + keyword + "%")
                        );
            }
        }

        JPAQuery<Recruitment> query = queryFactory
                .selectFrom(recruitment)
                .leftJoin(recruitment.creator, user)
                .where(builder)
                .orderBy(recruitment.createdDateTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        long totalCount = queryFactory
                .select(recruitment.count())
                .from(recruitment)
                .leftJoin(recruitment.creator, user)
                .where(builder)
                .fetchOne();

        System.out.println("백엔드 TotalCount : " + totalCount);

        List<Recruitment> recruitments = query.fetch();

        List<RecruitmentListDto> results = recruitments.stream()
                .map(RecruitmentListDto::recruitmentsFromEntity)
                .toList();

        return new PageImpl<>(results, pageable, totalCount);
    }
}
