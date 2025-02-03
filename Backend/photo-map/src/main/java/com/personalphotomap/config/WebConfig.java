package com.personalphotomap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Não há necessidade de mapear recursos locais, pois as imagens são servidas pelo AWS S3.
}