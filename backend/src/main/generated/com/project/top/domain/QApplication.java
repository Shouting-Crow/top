package com.project.top.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QApplication is a Querydsl query type for Application
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QApplication extends EntityPathBase<Application> {

    private static final long serialVersionUID = -83563327L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QApplication application = new QApplication("application");

    public final QUser applicant;

    public final DateTimePath<java.time.LocalDateTime> applyDateTime = createDateTime("applyDateTime", java.time.LocalDateTime.class);

    public final QBasePost basePost;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final EnumPath<ApplicationStatus> status = createEnum("status", ApplicationStatus.class);

    public QApplication(String variable) {
        this(Application.class, forVariable(variable), INITS);
    }

    public QApplication(Path<? extends Application> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QApplication(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QApplication(PathMetadata metadata, PathInits inits) {
        this(Application.class, metadata, inits);
    }

    public QApplication(Class<? extends Application> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.applicant = inits.isInitialized("applicant") ? new QUser(forProperty("applicant"), inits.get("applicant")) : null;
        this.basePost = inits.isInitialized("basePost") ? new QBasePost(forProperty("basePost"), inits.get("basePost")) : null;
    }

}

