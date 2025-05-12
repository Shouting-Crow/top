package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChatRoomReadLog is a Querydsl query type for ChatRoomReadLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChatRoomReadLog extends EntityPathBase<ChatRoomReadLog> {

    private static final long serialVersionUID = 1328132332L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QChatRoomReadLog chatRoomReadLog = new QChatRoomReadLog("chatRoomReadLog");

    public final QChatRoom chatRoom;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> lastReadTime = createDateTime("lastReadTime", java.time.LocalDateTime.class);

    public final QUser user;

    public QChatRoomReadLog(String variable) {
        this(ChatRoomReadLog.class, forVariable(variable), INITS);
    }

    public QChatRoomReadLog(Path<? extends ChatRoomReadLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QChatRoomReadLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QChatRoomReadLog(PathMetadata metadata, PathInits inits) {
        this(ChatRoomReadLog.class, metadata, inits);
    }

    public QChatRoomReadLog(Class<? extends ChatRoomReadLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.chatRoom = inits.isInitialized("chatRoom") ? new QChatRoom(forProperty("chatRoom"), inits.get("chatRoom")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user"), inits.get("user")) : null;
    }

}

