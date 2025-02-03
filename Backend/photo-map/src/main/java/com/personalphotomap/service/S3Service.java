package com.personalphotomap.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import org.springframework.web.multipart.MultipartFile;
import java.net.URL;
import java.util.UUID;
import software.amazon.awssdk.core.sync.RequestBody;

@Service
public class S3Service {

    private final S3Client s3Client;

    // Construtor correto para injeção
    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) {
        try {
            // Gera um nome único para o arquivo
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

            // Faz o upload para o S3
            s3Client.putObject(
                b -> b.bucket(System.getenv("S3_BUCKET_NAME")).key(fileName),
                RequestBody.fromBytes(file.getBytes())
            );

            // Obtém a URL do arquivo
            URL fileUrl = s3Client.utilities().getUrl(b -> b.bucket(System.getenv("S3_BUCKET_NAME")).key(fileName));

            return fileUrl.toString();
        } catch (Exception e) {
            throw new RuntimeException("Falha ao enviar arquivo para o S3", e);
        }
    }
}