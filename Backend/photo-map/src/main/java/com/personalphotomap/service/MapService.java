package com.personalphotomap.service;

import com.personalphotomap.model.Image;
import com.personalphotomap.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MapService {

    @Autowired
    private ImageRepository imageRepository;

    public List<String> getImageUrlsByCountryAndUser(String countryId, String email) {
        List<Image> images = imageRepository.findByCountryIdAndEmail(countryId, email);
        String envBackendUrl = System.getenv("BACKEND_URL");
        final String backendUrl = (envBackendUrl == null || envBackendUrl.isEmpty())
                ? "http://localhost:8092"
                : envBackendUrl;

        return images.stream()
                .map(image -> backendUrl + image.getFilePath()) // backendUrl agora é final
                .collect(Collectors.toList());

    }
}
