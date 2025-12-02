# Usar imagen oficial de Java
FROM eclipse-temurin:21-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos Java
COPY src/ ./src/

# Compilar
RUN javac src/*.java

# Comando por defecto (ejecutar la aplicación)
CMD ["java", "-cp", "src", "Main"]
