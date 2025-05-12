package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRecruitment is a Querydsl query type for Recruitment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRecruitment extends EntityPathBase<Recruitment> {

    private static final long serialVersionUID = -857033459L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRecruitment recruitment = new QRecruitment("recruitment");

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

    // inherited
    public final QGroup group;

    //inherited
    public final NumberPath<Long> id;

    //inherited
    public final BooleanPath isInactive;

    public final ListPath<String, StringPath> tags = this.<String, StringPath>createList("tags", String.class, StringPath.class, PathInits.DIRECT2);

    //inherited
    public final StringPath title;

    //inherited
    public final NumberPath<Integer> totalMembers;

    public QRecruitment(String variable) {
        this(Recruitment.class, forVariable(variable), INITS);
    }

    public QRecruitment(Path<? extends Recruitment> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRecruitment(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRecruitment(PathMetadata metadata, PathInits inits) {
        this(Recruitment.class, metadata, inits);
    }

    public QRecruitment(Class<? extends Recruitment> type, PathMetadata metadata, PathInits inits) {
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

