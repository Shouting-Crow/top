package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = -400551558L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUser user = new QUser("user");

    public final ListPath<Application, QApplication> applications = this.<Application, QApplication>createList("applications", Application.class, QApplication.class, PathInits.DIRECT2);

    public final ListPath<Board, QBoard> boards = this.<Board, QBoard>createList("boards", Board.class, QBoard.class, PathInits.DIRECT2);

    public final ListPath<ChatRoomReadLog, QChatRoomReadLog> chatRoomReadLogs = this.<ChatRoomReadLog, QChatRoomReadLog>createList("chatRoomReadLogs", ChatRoomReadLog.class, QChatRoomReadLog.class, PathInits.DIRECT2);

    public final StringPath email = createString("email");

    public final ListPath<GroupMember, QGroupMember> groupMembers = this.<GroupMember, QGroupMember>createList("groupMembers", GroupMember.class, QGroupMember.class, PathInits.DIRECT2);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath loginId = createString("loginId");

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final StringPath phoneNumber = createString("phoneNumber");

    public final ListPath<Message, QMessage> receivedMessages = this.<Message, QMessage>createList("receivedMessages", Message.class, QMessage.class, PathInits.DIRECT2);

    public final ListPath<Recruitment, QRecruitment> recruitments = this.<Recruitment, QRecruitment>createList("recruitments", Recruitment.class, QRecruitment.class, PathInits.DIRECT2);

    public final ListPath<Reply, QReply> replies = this.<Reply, QReply>createList("replies", Reply.class, QReply.class, PathInits.DIRECT2);

    public final StringPath role = createString("role");

    public final ListPath<ChatMessage, QChatMessage> sentChatMessages = this.<ChatMessage, QChatMessage>createList("sentChatMessages", ChatMessage.class, QChatMessage.class, PathInits.DIRECT2);

    public final ListPath<Message, QMessage> sentMessages = this.<Message, QMessage>createList("sentMessages", Message.class, QMessage.class, PathInits.DIRECT2);

    public final ListPath<StudyGroup, QStudyGroup> studyGroups = this.<StudyGroup, QStudyGroup>createList("studyGroups", StudyGroup.class, QStudyGroup.class, PathInits.DIRECT2);

    public final QUserInfo userInfo;

    public QUser(String variable) {
        this(User.class, forVariable(variable), INITS);
    }

    public QUser(Path<? extends User> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUser(PathMetadata metadata, PathInits inits) {
        this(User.class, metadata, inits);
    }

    public QUser(Class<? extends User> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.userInfo = inits.isInitialized("userInfo") ? new QUserInfo(forProperty("userInfo"), inits.get("userInfo")) : null;
    }

}

