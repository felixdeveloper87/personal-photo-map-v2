package com.personalphotomap.service;

import com.personalphotomap.model.Image;
import com.personalphotomap.repository.ImageRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;
    
    @Autowired
    private S3Service s3Service; // Injeção do S3Service para realizar o upload e a deleção no S3

    /**
     * Realiza o upload das imagens utilizando o S3 e salva os metadados no banco de dados.
     * Apenas arquivos do tipo image/jpeg são considerados.
     */
    public List<String> uploadImages(List<MultipartFile> files, String countryId, int year, String username) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        Tika tika = new Tika();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            String mimeType = tika.detect(file.getInputStream());
            if (!mimeType.equalsIgnoreCase("image/jpeg")) {
                continue;
            }

            // Faz o upload para o S3 e obtém a URL do arquivo
            String fileUrl = s3Service.uploadFile(file);

            // Cria a entidade Image com os metadados e a URL retornada pelo S3
            Image image = new Image();
            image.setCountryId(countryId);
            image.setFileName(file.getOriginalFilename()); // ou gere um nome se preferir
            image.setFilePath(fileUrl);  // Armazena a URL do S3
            image.setYear(year);
            image.setEmail(username);

            imageRepository.save(image);
            imageUrls.add(fileUrl);
        }
        return imageUrls;
    }

    /**
     * Exclui as imagens tanto do S3 quanto do banco de dados.
     */
    public void deleteImages(List<Image> images) {
        for (Image image : images) {
            // Chama o método do S3Service para deletar o arquivo no S3
            s3Service.deleteFile(image.getFilePath());
        }
        // Remove os registros do banco de dados
        imageRepository.deleteAll(images);
    }

    /**
     * Exemplo de método para buscar imagens por país, ano e email.
     */
    public List<Image> getImagesByCountryAndYear(String countryId, int year, String email) {
        return imageRepository.findByCountryIdAndYearAndEmail(countryId, year, email);
    }
}