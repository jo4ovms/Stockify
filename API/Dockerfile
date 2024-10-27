# Build stage
FROM openjdk:17-oracle AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean install -DskipTests

# Package stage
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/StockifyAPI-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
