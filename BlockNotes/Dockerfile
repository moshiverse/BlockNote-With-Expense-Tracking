# Use Java 21 runtime
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven wrapper and project files
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose the default Spring Boot port
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "target/BlockNotes-0.0.1-SNAPSHOT.jar"]
