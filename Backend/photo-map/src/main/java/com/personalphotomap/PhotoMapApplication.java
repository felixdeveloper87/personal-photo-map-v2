package com.personalphotomap;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PhotoMapApplication {
    public static void main(String[] args) {
        // Carregar apenas se as variáveis ainda não estiverem no ambiente
        if (System.getenv("SPRING_DATASOURCE_URL") == null) {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
        }

        SpringApplication.run(PhotoMapApplication.class, args);
    }
}
