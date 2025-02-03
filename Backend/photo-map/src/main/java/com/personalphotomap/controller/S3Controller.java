package com.personalphotomap.controller;

import com.personalphotomap.dto.S3UploadResponseDTO;
import com.personalphotomap.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3Service s3Service;

    @Autowired
    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public ResponseEntity<S3UploadResponseDTO> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(new S3UploadResponseDTO(fileUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new S3UploadResponseDTO("Erro ao enviar imagem para o S3: " + e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testS3() {
        return ResponseEntity.ok("S3 Controller is working!");
    }
}