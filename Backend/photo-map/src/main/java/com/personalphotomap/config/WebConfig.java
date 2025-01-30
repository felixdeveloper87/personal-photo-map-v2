package com.personalphotomap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadDir = System.getProperty("user.dir") + "/api/images/uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/images/uploads/**")
                .addResourceLocations("file:" + uploadDir);
    }
}

// ajustar essa classe para armazenar as imagens no AWS S3