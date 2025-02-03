package com.personalphotomap.controller;

import com.personalphotomap.model.Image;
import com.personalphotomap.repository.ImageRepository;
import com.personalphotomap.security.JwtUtil;
import com.personalphotomap.service.S3Service;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private JwtUtil jwtUtil;
    
    // Injeta o serviço do S3 para operações de upload e deleção
    @Autowired
    private S3Service s3Service;

    // Endpoint para upload de imagens (apenas imagens JPEG)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @RequestParam("images") List<MultipartFile> files,
            @RequestParam("countryId") String countryId,
            @RequestParam("year") int year,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido ou expirado.");
        }

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum arquivo foi enviado.");
        }

        List<String> imageUrls = new ArrayList<>();
        List<String> invalidFiles = new ArrayList<>();
        Tika tika = new Tika();

        try {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                String mimeType = tika.detect(file.getInputStream());
                if (!mimeType.equalsIgnoreCase("image/jpeg")) {
                    invalidFiles.add(file.getOriginalFilename());
                    continue;
                }

                // Realiza o upload para o S3 e obtém a URL do arquivo
                String fileUrl = s3Service.uploadFile(file);

                // Cria o registro da imagem com os metadados e a URL retornada pelo S3
                Image image = new Image();
                image.setCountryId(countryId);
                image.setFileName(file.getOriginalFilename()); // ou gere um nome único se preferir
                image.setFilePath(fileUrl); // URL do arquivo no S3
                image.setYear(year);
                image.setEmail(email);
                imageRepository.save(image);

                imageUrls.add(fileUrl);
            }

            if (imageUrls.isEmpty()) {
                return ResponseEntity.badRequest().body("Nenhuma imagem JPG válida foi carregada.");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Imagens carregadas com sucesso.");
            response.put("imageUrls", imageUrls);
            if (!invalidFiles.isEmpty()) {
                response.put("invalidFiles", invalidFiles);
            }
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao carregar as imagens: " + e.getMessage());
        }
    }

    // Endpoint para deletar todas as imagens de um país (deleta do S3 e do banco)
    @DeleteMapping("/delete-all-images/{countryId}")
    public ResponseEntity<?> deleteAllImagesByCountry(
            @PathVariable String countryId,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Image> images = imageRepository.findByCountryIdAndEmail(countryId, email);
        if (images.isEmpty()) {
            return ResponseEntity.ok("Nenhuma imagem encontrada para o país " + countryId);
        }

        // Para cada imagem, deleta o arquivo no S3
        for (Image image : images) {
            try {
                s3Service.deleteFile(image.getFilePath());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro ao deletar o arquivo no S3: " + e.getMessage());
            }
        }

        // Remove os registros do banco de dados
        imageRepository.deleteAll(images);
        return ResponseEntity.ok("Todas as imagens de " + countryId + " foram deletadas com sucesso.");
    }

    // Endpoint para deletar imagens de um país e ano específico
    @DeleteMapping("/{countryId}/{year}")
    public ResponseEntity<?> deleteImagesByCountryAndYear(
            @PathVariable String countryId,
            @PathVariable int year,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token JWT inválido ou expirado.");
        }

        List<Image> images = imageRepository.findByCountryIdAndYearAndEmail(countryId, year, email);
        if (images.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma imagem encontrada para o ano " + year + ".");
        }

        // Deleta cada arquivo do S3
        for (Image image : images) {
            try {
                s3Service.deleteFile(image.getFilePath());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erro ao deletar o arquivo no S3: " + e.getMessage());
            }
        }

        imageRepository.deleteAll(images);
        return ResponseEntity.ok("Imagens de " + countryId + " no ano " + year + " foram deletadas com sucesso.");
    }

    // Endpoint para deletar uma imagem pelo ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteImageById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Image> optionalImage = imageRepository.findById(id);
        if (optionalImage.isPresent()) {
            Image image = optionalImage.get();
            if (!image.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para deletar esta imagem.");
            }

            try {
                s3Service.deleteFile(image.getFilePath());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar o arquivo no S3.");
            }

            imageRepository.delete(image);
            return ResponseEntity.ok("Imagem deletada com sucesso.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Imagem não encontrada.");
        }
    }

    // Endpoint para retornar as imagens de um país para o usuário autenticado
    @GetMapping("/{countryId}")
    public ResponseEntity<List<Image>> getImagesByCountry(
            @PathVariable String countryId,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Image> images = imageRepository.findByCountryIdAndEmail(countryId, email);
        if (images.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(images);
    }

    // Endpoint para retornar os países onde o usuário tem fotos
    @GetMapping("/countries-with-photos")
    public ResponseEntity<List<String>> getCountriesWithPhotos(
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<String> countries = imageRepository.findDistinctCountryIdsByEmail(email);
        if (countries.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(countries);
    }

    // Endpoint para retornar todas as imagens do usuário, ordenadas por data de upload
    @GetMapping("/allPictures")
    public ResponseEntity<List<Image>> getAllImages(
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Image> images = imageRepository.findByEmailOrderByUploadDateDesc(email);
        if (images.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(images);
    }

    // Endpoint para retornar os anos (datas) em que há imagens para um país específico
    @GetMapping("/{countryId}/years")
    public ResponseEntity<List<Integer>> getYearsByCountry(
            @PathVariable String countryId,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Integer> years = imageRepository.findDistinctYearsByCountryIdAndEmail(countryId, email);
        return ResponseEntity.ok(years);
    }

    // Endpoint para retornar as imagens de um país e ano específico para o usuário autenticado
    @GetMapping("/{countryId}/{year}")
    public ResponseEntity<List<Image>> getImagesByCountryAndYear(
            @PathVariable String countryId,
            @PathVariable int year,
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Image> images = imageRepository.findByCountryIdAndYearAndEmail(countryId, year, email);
        return ResponseEntity.ok(images);
    }

    // Endpoint para retornar a contagem total de fotos e de países únicos do usuário
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> countUserPhotosAndCountries(
            @RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        long photoCount = imageRepository.countByEmail(email);
        long countryCount = imageRepository.countDistinctCountryByEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("photoCount", photoCount);
        response.put("countryCount", countryCount);

        return ResponseEntity.ok(response);
    }
}