FROM openjdk:17-jdk-slim

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw.cmd

COPY src src

COPY src/main/resources/static src/main/resources/static

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/passwordgenerator_lab3-0.0.1-SNAPSHOT.jar"]