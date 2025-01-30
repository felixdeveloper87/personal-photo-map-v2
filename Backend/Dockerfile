#Backend/
# 1) Etapa de build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia os arquivos do projeto
COPY photo-map/pom.xml . 
COPY photo-map/src ./src

# Build do JAR
RUN mvn clean package -DskipTests

# 2) Etapa de execução
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8092
ENTRYPOINT ["java", "-jar", "app.jar"]
