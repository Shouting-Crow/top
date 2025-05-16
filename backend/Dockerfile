FROM openjdk:17-jdk-alpine

WORKDIR /top

RUN apk add --no-cache bash netcat-openbsd

COPY build/libs/top-0.0.1-SNAPSHOT.jar top.jar
COPY wait-for-it.sh wait-for-it.sh

RUN chmod +x wait-for-it.sh

ENTRYPOINT ["./wait-for-it.sh", "mysql", "java", "-jar", "/top/top.jar"]