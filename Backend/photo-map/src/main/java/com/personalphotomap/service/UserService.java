package com.personalphotomap.service;

import com.personalphotomap.model.AppUser;
import com.personalphotomap.dto.RegisterRequest;
import com.personalphotomap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Método para registrar novo usuário
    public String registerUser(RegisterRequest registerRequest) {
//        if (userRepository.findByUsername(registerRequest.getEmail()) != null) {
//            return "Nome de usuário já está em uso.";
//        }
        if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
            return "Email já está em uso.";
        }

        AppUser newUser = new AppUser();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRole("ROLE_USER");

        userRepository.save(newUser);
        return "Usuário registrado com sucesso.";
    }

    public Optional<AppUser> findByEmail(String email) {
        return Optional.ofNullable(userRepository.findByEmail(email));
    }

//    public Optional<AppUser> findByUsername(String username) {
//        return Optional.ofNullable(userRepository.findByUsername(username));
//    }
}
