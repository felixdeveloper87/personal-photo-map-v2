package com.personalphotomap.dto;

public class LoginRequest {
    private String email;
    private String password;

    // Construtor vazio
    public LoginRequest() {}

    // Construtor completo
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters e Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String username) {
        this.email = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
