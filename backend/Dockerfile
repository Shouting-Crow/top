FROM openjdk:17-jdk-alpine

WORKDIR /top

RUN apk add --no-cache bash netcat-openbsd

COPY build/libs/top-0.0.1-SNAPSHOT.jar top.jar

ENTRYPOINT ["java", "-jar", "/top/top.jar"]