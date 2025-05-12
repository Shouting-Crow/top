package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGroupMember is a Querydsl query type for GroupMember
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGroupMember extends EntityPathBase<GroupMember> {

    private static final long serialVersionUID = -1064289942L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGroupMember groupMember = new QGroupMember("groupMember");

    public final QGroup group;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> joinedAt = createDateTime("joinedAt", java.time.LocalDateTime.class);

    public final QUser member;

    public final EnumPath<GroupRole> role = createEnum("role", GroupRole.class);

    public QGroupMember(String variable) {
        this(GroupMember.class, forVariable(variable), INITS);
    }

    public QGroupMember(Path<? extends GroupMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGroupMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGroupMember(PathMetadata metadata, PathInits inits) {
        this(GroupMember.class, metadata, inits);
    }

    public QGroupMember(Class<? extends GroupMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.group = inits.isInitialized("group") ? new QGroup(forProperty("group"), inits.get("group")) : null;
        this.member = inits.isInitialized("member") ? new QUser(forProperty("member"), inits.get("member")) : null;
    }

}

