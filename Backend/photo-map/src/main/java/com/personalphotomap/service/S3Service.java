package com.personalphotomap.service;

import com.personalphotomap.dto.S3UploadResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;


import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    // Correção: Pegando a variável correta do sistema
    private final String bucketName = System.getenv("S3_BUCKET_NAME");

    public S3UploadResponseDTO uploadFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            String fileUrl = "https://" + bucketName + ".s3." + System.getenv("AWS_REGION") + ".amazonaws.com/" + fileName;
            return new S3UploadResponseDTO(fileUrl);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload para S3", e);
        }
    }

}

