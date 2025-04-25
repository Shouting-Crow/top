package com.project.top.repository;

import com.project.top.domain.QStudyGroup;
import com.project.top.domain.QUser;
import com.project.top.domain.StudyGroup;
import com.project.top.dto.studyGroup.StudyGroupListDto;
import com.project.top.dto.studyGroup.StudyGroupSearchDto;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class StudyGroupRepositoryImpl implements StudyGroupRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<StudyGroupListDto> searchStudyGroups(StudyGroupSearchDto studyGroupSearchDto, Pageable pageable) {
        QStudyGroup studyGroup = QStudyGroup.studyGroup;
        QUser user = QUser.user;

        BooleanBuilder builder = new BooleanBuilder();

        if (StringUtils.hasText(studyGroupSearchDto.getKeyword()) && studyGroupSearchDto.getKeyword().length() >= 2) {
            String keyword = studyGroupSearchDto.getKeyword();

            switch (studyGroupSearchDto.getSearchType()) {
                case "title" ->
                        builder.and(studyGroup.title.like("%" + keyword + "%"));

                case "creator" ->
                        builder.and(studyGroup.creator.nickname.like("%" + keyword + "%"));

                case "content" ->
                        builder.and(studyGroup.description.like("%" + keyword + "%"));

                case "all" ->
                        builder.andAnyOf(
                                studyGroup.title.like("%" + keyword + "%"),
                                studyGroup.creator.nickname.like("%" + keyword + "%"),
                                studyGroup.description.like("%" + keyword + "%")
                        );
            }
        }

        JPAQuery<StudyGroup> query = queryFactory
                .selectFrom(studyGroup)
                .leftJoin(studyGroup.creator, user)
                .where(builder)
                .orderBy(studyGroup.createdDateTime.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        long totalCount = queryFactory
                .select(studyGroup.count())
                .from(studyGroup)
                .leftJoin(studyGroup.creator, user)
                .where(builder)
                .fetchOne();

        System.out.println("백엔드 TotalCount : " + totalCount);

        List<StudyGroup> studyGroups = query.fetch();

        List<StudyGroupListDto> results = studyGroups.stream()
                .map(StudyGroupListDto::studyGroupListDtoFromEntity)
                .toList();

        return new PageImpl<>(results, pageable, totalCount);
    }
}
