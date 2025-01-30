package com.personalphotomap.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String countryId;
    private String fileName;
    private String email;
    private String filePath;
    private int year;

    @Column(name = "upload_date", updatable = false)
    private LocalDateTime uploadDate;

    // Construtor vazio
    public Image() {
    }

    // Construtor completo
    public Image(Long id, String countryId, String fileName, String email, String filePath, int year) {
        this.id = id;
        this.countryId = countryId;
        this.fileName = fileName;
        this.email = email;
        this.filePath = filePath;
        this.year = year;

    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountryId() {
        return countryId;
    }

    public void setCountryId(String countryId) {
        this.countryId = countryId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getEmail() {
        return email; // Atualize o getter
    }

    public void setEmail(String email) {
        this.email = email; // Atualize o setter
    }


    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    // Método chamado automaticamente antes de persistir um novo registro
    @PrePersist
    protected void onCreate() {
        this.uploadDate = LocalDateTime.now();  // Define a data e hora atuais
    }
}
