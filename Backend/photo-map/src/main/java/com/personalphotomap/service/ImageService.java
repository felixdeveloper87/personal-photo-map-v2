package com.personalphotomap.service;

import com.personalphotomap.model.Image;
import com.personalphotomap.repository.ImageRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    private final String uploadDir = System.getProperty("user.dir") + "/api/images/uploads/";

    public List<String> uploadImages(List<MultipartFile> files, String countryId, int year, String username) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        Tika tika = new Tika();

        Path uploadPath = Paths.get(uploadDir + countryId);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String mimeType = tika.detect(file.getInputStream());
            if (!mimeType.equalsIgnoreCase("image/jpeg")) continue;

            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Image image = new Image();
            image.setCountryId(countryId);
            image.setFileName(fileName);
            image.setFilePath("/api/images/uploads/" + countryId + "/" + fileName);
            image.setYear(year);
            image.setEmail(username);

            String backendUrl = System.getenv("BACKEND_URL");
            if (backendUrl == null || backendUrl.isEmpty()) {
                backendUrl = "http://localhost:8092"; // Usa localhost se a variável não estiver definida
            }

            imageUrls.add(backendUrl + image.getFilePath());

        }
        return imageUrls;
    }

    public List<Image> getImagesByCountryAndYear(String countryId, int year, String email) {
        return imageRepository.findByCountryIdAndYearAndEmail(countryId, year, email);
    }


    public void deleteImages(List<Image> images) throws IOException {
        for (Image image : images) {
            Path imagePath = Paths.get(System.getProperty("user.dir") + image.getFilePath());
            if (Files.exists(imagePath)) {
                Files.delete(imagePath);
            }
        }
        imageRepository.deleteAll(images);
    }
}
