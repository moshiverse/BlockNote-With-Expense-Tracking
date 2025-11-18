# Use Java 21 runtime
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven wrapper & pom.xml first (for caching)
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Copy the rest of the source code
COPY src src

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the project
RUN ./mvnw clean package -DskipTests

# Run the JAR
CMD ["java", "-jar", "target/BlockNotes-0.0.1-SNAPSHOT.jar"]
