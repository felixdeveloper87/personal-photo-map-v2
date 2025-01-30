package com.personalphotomap.controller;

import com.personalphotomap.model.AppUser;
import com.personalphotomap.dto.RegisterRequest;
import com.personalphotomap.repository.UserRepository;
import com.personalphotomap.security.JwtUtil;
import com.personalphotomap.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")  // Separando as rotas de autenticação em /api/auth para melhor organização
public class AuthController {

    @Autowired
    private UserRepository userRepository; // Alterado para UserRepository para consistência

    @Autowired
    private JwtUtil jwtUtil; // Utilitário para gerar e validar tokens JWT

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Endpoint de login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Buscando o usuário no banco de dados pelo email
        AppUser user = userRepository.findByEmail(loginRequest.getEmail());

        // Se o usuário não for encontrado ou a senha não bater, retorna erro
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }

        // Se for bem-sucedido, gera um token JWT
        String token = jwtUtil.generateToken(user.getEmail());

        // Retorna o token de autenticação
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("fullname", user.getFullname());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    // Endpoint de registro de novos usuários
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Verifica se o nome de usuário ou email já existe
        if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já está em uso.");
        }

        // Cria uma nova instância de AppUser
        AppUser newUser = new AppUser();

        newUser.setFullname(registerRequest.getFullname()); // Adiciona fullname
        newUser.setEmail(registerRequest.getEmail());
        newUser.setCountry(registerRequest.getCountry()); // Adiciona country
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Criptografa a senha
        newUser.setRole("ROLE_USER"); // Define o papel padrão como "ROLE_USER"

        // Salva o novo usuário no banco de dados
        userRepository.save(newUser);

        return ResponseEntity.ok("Usuário registrado com sucesso.");
    }

    // Endpoint para buscar todos os usuários (para fins administrativos)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Verifica se o usuário existe
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        // Deleta o usuário do banco de dados
        userRepository.deleteById(id);
        return ResponseEntity.ok("Usuário deletado com sucesso.");
    }


}
