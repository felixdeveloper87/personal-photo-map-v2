package com.personalphotomap.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URL;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;

    // Construtor para injeção de dependência
    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Faz o upload do arquivo para o S3 e retorna a URL pública.
     */
    public String uploadFile(MultipartFile file) {
        try {
            // Gera um nome único para o arquivo
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

            // Faz o upload do arquivo para o bucket S3
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

    /**
     * Exclui o arquivo do S3 a partir da URL.
     * OBS: Essa implementação pressupõe que a chave (key) do objeto é a parte final da URL.
     * Em casos reais, pode ser interessante armazenar a key separadamente para facilitar a deleção.
     */
    public void deleteFile(String fileUrl) {
        try {
            String bucketName = System.getenv("S3_BUCKET_NAME");
            // Extração simplificada da key: pega o que vem após a última barra
            String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            s3Client.deleteObject(b -> b.bucket(bucketName).key(key));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar arquivo no S3", e);
        }
    }
}