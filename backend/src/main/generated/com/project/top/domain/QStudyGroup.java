package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStudyGroup is a Querydsl query type for StudyGroup
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStudyGroup extends EntityPathBase<StudyGroup> {

    private static final long serialVersionUID = -410184539L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStudyGroup studyGroup = new QStudyGroup("studyGroup");

    public final QBasePost _super;

    //inherited
    public final ListPath<Application, QApplication> applications;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDateTime;

    // inherited
    public final QUser creator;

    //inherited
    public final NumberPath<Integer> currentMembers;

    //inherited
    public final StringPath description;

    //inherited
    public final DatePath<java.time.LocalDate> dueDate;

    public final DatePath<java.time.LocalDate> endDate = createDate("endDate", java.time.LocalDate.class);

    // inherited
    public final QGroup group;

    //inherited
    public final NumberPath<Long> id;

    //inherited
    public final BooleanPath isInactive;

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    //inherited
    public final StringPath title;

    public final StringPath topic = createString("topic");

    //inherited
    public final NumberPath<Integer> totalMembers;

    public QStudyGroup(String variable) {
        this(StudyGroup.class, forVariable(variable), INITS);
    }

    public QStudyGroup(Path<? extends StudyGroup> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStudyGroup(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStudyGroup(PathMetadata metadata, PathInits inits) {
        this(StudyGroup.class, metadata, inits);
    }

    public QStudyGroup(Class<? extends StudyGroup> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new QBasePost(type, metadata, inits);
        this.applications = _super.applications;
        this.createdDateTime = _super.createdDateTime;
        this.creator = _super.creator;
        this.currentMembers = _super.currentMembers;
        this.description = _super.description;
        this.dueDate = _super.dueDate;
        this.group = _super.group;
        this.id = _super.id;
        this.isInactive = _super.isInactive;
        this.title = _super.title;
        this.totalMembers = _super.totalMembers;
    }

}

