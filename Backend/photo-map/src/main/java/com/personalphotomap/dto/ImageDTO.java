package com.personalphotomap.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ImageDTO {
    private Long id;
    private String countryId;
    private String fileName;
    private String email;
    private String filePath;
    private int year;
    private LocalDateTime uploadDate;

    // Construtor vazio
    public ImageDTO() {}

    // Construtor com todos os campos
    public ImageDTO(Long id, String countryId, String fileName, String email, String filePath, int year, LocalDateTime uploadDate) {
        this.id = id;
        this.countryId = countryId;
        this.fileName = fileName;
        this.email = email;
        this.filePath = filePath;
        this.year = year;
        this.uploadDate = uploadDate;
    }
}