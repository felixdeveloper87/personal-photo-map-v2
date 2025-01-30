package com.personalphotomap.controller;

import com.personalphotomap.model.Image;
import com.personalphotomap.repository.ImageRepository;
import com.personalphotomap.security.JwtUtil;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/images")
//@CrossOrigin(origins = "http://localhost:5174")
public class ImageController {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final String uploadDir = System.getProperty("user.dir") + "/api/images/uploads/";

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @RequestParam("images") List<MultipartFile> files,
            @RequestParam("countryId") String countryId,
            @RequestParam("year") int year,
            @RequestHeader(value = "Authorization") String token) {

        // Verifica se o token foi fornecido e extrai o username
        String email = jwtUtil.extractUsernameFromToken(token);  // Função auxiliar para extrair o username
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Retorna 401 se o token for inválido
        }

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum arquivo foi enviado.");
        }

        List<String> imageUrls = new ArrayList<>();
        List<String> invalidFiles = new ArrayList<>();
        Tika tika = new Tika();

        try {
            Path uploadPath = Paths.get(uploadDir + countryId);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                String mimeType = tika.detect(file.getInputStream());
                if (!mimeType.equalsIgnoreCase("image/jpeg")) {
                    invalidFiles.add(file.getOriginalFilename());
                    continue;
                }

                String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Criando e salvando a entidade Image com o username
                Image image = new Image();
                image.setCountryId(countryId);
                image.setFileName(fileName);
                image.setFilePath("/api/images/uploads/" + countryId + "/" + fileName);
                image.setYear(year);
                image.setEmail(email);  // Define o usuário dono da imagem

                imageRepository.save(image);

                String backendUrl = System.getenv("BACKEND_URL");
                if (backendUrl == null || backendUrl.isEmpty()) {
                    backendUrl = "http://localhost:8092"; // Usa localhost se a variável não estiver definida
                }
                imageUrls.add(backendUrl + image.getFilePath());

            }

            if (imageUrls.isEmpty()) {
                return ResponseEntity.badRequest().body("Nenhuma imagem JPG válida foi carregada.");
            }

            return ResponseEntity.ok(Map.of("message", "Imagens carregadas com sucesso.", "imageUrls", imageUrls));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao carregar as imagens: " + e.getMessage());
        }
    }


    // Método para deletar todas as imagens e os registros do banco de dados
    @DeleteMapping("/delete-all-images/{countryId}")
    public ResponseEntity<?> deleteAllImagesByCountry(
            @PathVariable String countryId,
            @RequestHeader(value = "Authorization") String token) {

        // Verifica se o token foi fornecido e extrai o username
        String email = jwtUtil.extractUsernameFromToken(token);  // Função auxiliar para extrair o username
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Retorna 401 se o token for inválido
        }

        List<Image> images = imageRepository.findByCountryIdAndEmail(countryId, email);
        if (images.isEmpty()) {
            return ResponseEntity.ok("Nenhuma imagem encontrada para o país " + countryId);
        }

        imageRepository.deleteAll(images);

        try {
            Path countryPath = Paths.get(uploadDir + countryId);
            if (Files.exists(countryPath)) {
                Files.walk(countryPath)
                        .filter(Files::isRegularFile)
                        .forEach(filePath -> {
                            try {
                                Files.delete(filePath);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });
            }

            return ResponseEntity.ok("Todas as imagens de " + countryId + " foram deletadas com sucesso.");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar as imagens.");
        }
    }

    @DeleteMapping("/{countryId}/{year}")
    public ResponseEntity<?> deleteImagesByCountryAndYear(
            @PathVariable String countryId,
            @PathVariable int year,
            @RequestHeader(value = "Authorization") String token) {

        // Verifica e extrai o username do token JWT
        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token JWT inválido ou expirado.");
        }

        try {
            // Busca as imagens pelo país, ano e usuário
            List<Image> images = imageRepository.findByCountryIdAndYearAndEmail(countryId, year, email);

            if (images.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma imagem encontrada para o ano " + year + ".");
            }

            // Deleta os registros de imagens do banco de dados
            imageRepository.deleteAll(images);

            // Deleta fisicamente os arquivos
            for (Image image : images) {
                Path imagePath = Paths.get(System.getProperty("user.dir") + image.getFilePath());
                if (Files.exists(imagePath)) {
                    Files.delete(imagePath);
                    System.out.println("Deleted file: " + imagePath);
                } else {
                    System.out.println("File not found: " + imagePath);
                }
            }

            return ResponseEntity.ok("Imagens de " + countryId + " no ano " + year + " foram deletadas com sucesso.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar as imagens.");
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteImageById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization") String token) {

        // Verifica se o token foi fornecido e extrai o username
        String email = jwtUtil.extractUsernameFromToken(token);  // Função auxiliar para extrair o username
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Retorna 401 se o token for inválido
        }

        Optional<Image> optionalImage = imageRepository.findById(id);
        if (optionalImage.isPresent()) {
            Image image = optionalImage.get();
            if (!image.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para deletar esta imagem.");
            }

            try {
                System.out.println("ID da imagem recebida: " + id);
                System.out.println("Caminho do arquivo: " + image.getFilePath());
                Path imagePath = Paths.get(System.getProperty("user.dir") + image.getFilePath());
                if (Files.exists(imagePath)) {
                    Files.delete(imagePath);
                }

                imageRepository.delete(image);

                return ResponseEntity.ok("Imagem deletada com sucesso.");
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar a imagem.");
            }

        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Imagem não encontrada.");
        }
    }
    @GetMapping("/{countryId}")
    public ResponseEntity<List<Image>> getImagesByCountry(
            @PathVariable String countryId,
            @RequestHeader(value = "Authorization") String token) {


        String email = jwtUtil.extractUsernameFromToken(token);  // Função auxiliar para extrair o username
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Retorna 401 se o token for inválido
        }

        // Busca as imagens do país específico, mas apenas para o usuário autenticado
        List<Image> images = imageRepository.findByCountryIdAndEmail(countryId, email);

        if (images.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());  // Retorna lista vazia se não houver imagens
        }

        return ResponseEntity.ok(images);  // Retorna as imagens do usuário logado
    }

    @GetMapping("/countries-with-photos")
    public ResponseEntity<List<String>> getCountriesWithPhotos(@RequestHeader(value = "Authorization") String token) {
        // Verifica se o token foi fornecido e extrai o username
        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Buscar os países onde o usuário tem fotos
        List<String> countries = imageRepository.findDistinctCountryIdsByEmail(email);

        if (countries.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(countries);
    }


    @GetMapping("/allPictures")
    public ResponseEntity<List<Image>> getAllImages(@RequestHeader(value = "Authorization") String token) {

        String email = jwtUtil.extractUsernameFromToken(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Image> images = imageRepository.findByEmailOrderByUploadDateDesc(email);

        if (images.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(images);  // Retorna a lista de imagens do usuário
    }


    @GetMapping("/{countryId}/years")
    public ResponseEntity<List<Integer>> getYearsByCountry(
            @PathVariable String countryId,
            @RequestHeader(value = "Authorization") String token) {

        // Verificação do token e extração do username
        String email = jwtUtil.extractUsernameFromToken(token);  // Função auxiliar para extrair o username
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Retorna 401 se o token for inválido
        }

        // Busca apenas os anos relacionados ao usuário autenticado
        List<Integer> years = imageRepository.findDistinctYearsByCountryIdAndEmail(countryId, email);

        return ResponseEntity.ok(years);
    }

    @GetMapping("/{countryId}/{year}")
    public ResponseEntity<List<Image>> getImagesByCountryAndYear(
            @PathVariable String countryId,
            @PathVariable int year,
            @RequestHeader(value = "Authorization") String token) {

        // Verificação do token e extração do username
        String email = jwtUtil.extractUsernameFromToken(token);  // Função auxiliar para extrair o username
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Retorna 401 se o token for inválido
        }

        // Busca apenas as imagens relacionadas ao usuário autenticado
        List<Image> images = imageRepository.findByCountryIdAndYearAndEmail(countryId, year, email);

        return ResponseEntity.ok(images);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> countUserPhotosAndCountries(@RequestHeader(value = "Authorization") String token) {
        String email = jwtUtil.extractUsernameFromToken(token); // Usando a função auxiliar para extrair o username do token

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        long photoCount = imageRepository.countByEmail(email); // Conta total de fotos
        long countryCount = imageRepository.countDistinctCountryByEmail(email); // Conta países únicos

        Map<String, Object> response = new HashMap<>();
        response.put("photoCount", photoCount);
        response.put("countryCount", countryCount);

        return ResponseEntity.ok(response);
    }



}