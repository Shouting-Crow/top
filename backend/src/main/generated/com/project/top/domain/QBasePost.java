package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBasePost is a Querydsl query type for BasePost
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBasePost extends EntityPathBase<BasePost> {

    private static final long serialVersionUID = 2010315072L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBasePost basePost = new QBasePost("basePost");

    public final ListPath<Application, QApplication> applications = this.<Application, QApplication>createList("applications", Application.class, QApplication.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> createdDateTime = createDateTime("createdDateTime", java.time.LocalDateTime.class);

    public final QUser creator;

    public final NumberPath<Integer> currentMembers = createNumber("currentMembers", Integer.class);

    public final StringPath description = createString("description");

    public final DatePath<java.time.LocalDate> dueDate = createDate("dueDate", java.time.LocalDate.class);

    public final QGroup group;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isInactive = createBoolean("isInactive");

    public final StringPath title = createString("title");

    public final NumberPath<Integer> totalMembers = createNumber("totalMembers", Integer.class);

    public QBasePost(String variable) {
        this(BasePost.class, forVariable(variable), INITS);
    }

    public QBasePost(Path<? extends BasePost> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBasePost(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBasePost(PathMetadata metadata, PathInits inits) {
        this(BasePost.class, metadata, inits);
    }

    public QBasePost(Class<? extends BasePost> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.creator = inits.isInitialized("creator") ? new QUser(forProperty("creator"), inits.get("creator")) : null;
        this.group = inits.isInitialized("group") ? new QGroup(forProperty("group"), inits.get("group")) : null;
    }

}

