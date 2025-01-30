package com.personalphotomap.controller;

import com.personalphotomap.dto.S3UploadResponseDTO;
import com.personalphotomap.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<S3UploadResponseDTO> uploadFile(@RequestParam("file") MultipartFile file) {
        S3UploadResponseDTO response = s3Service.uploadFile(file);
        return ResponseEntity.ok(response);
    }

}
