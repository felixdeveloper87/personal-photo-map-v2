package com.personalphotomap.controller;
import com.personalphotomap.model.Image;
import com.personalphotomap.repository.ImageRepository;
import com.personalphotomap.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/map")
public class MapController {

    @Autowired
    private ImageRepository imageRepository;  // Injetando o repositório de imagens

    @Autowired
    private JwtUtil jwtUtil;  // Injetando o utilitário JWT

    @GetMapping("/{countryId}")
    public ResponseEntity<?> getMapData(@PathVariable String countryId, @RequestHeader(value = "Authorization", required = false) String token) {
        // Verifica se o token está presente e é válido
        if (token == null || !token.startsWith("Bearer ") || !jwtUtil.validateToken(token.substring(7), null)) {
            return ResponseEntity.ok("Mapa sem fotos para " + countryId);  // Responde sem fotos se o usuário não estiver autenticado
        }

        // Extrai o nome do usuário do token JWT
        String email = jwtUtil.extractUsername(token.substring(7));  // Removendo "Bearer " antes de extrair o username

        // Carrega as imagens do usuário com base no countryId e username
        List<Image> images = imageRepository.findByCountryIdAndEmail(countryId, email);

        if (images.isEmpty()) {
            return ResponseEntity.ok("Nenhuma foto encontrada para este usuário em " + countryId);
        }

        // Converte as imagens para URLs
        String envBackendUrl = System.getenv("BACKEND_URL");
        final String backendUrl = (envBackendUrl == null || envBackendUrl.isEmpty())
                ? "http://localhost:8092"
                : envBackendUrl;

        List<String> imageUrls = images.stream()
                .map(image -> backendUrl + image.getFilePath()) // backendUrl agora é final
                .collect(Collectors.toList());

        return ResponseEntity.ok(imageUrls);
    }
}
