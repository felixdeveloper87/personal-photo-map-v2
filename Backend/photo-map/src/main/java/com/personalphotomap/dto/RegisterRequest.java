package com.personalphotomap.dto;

public class RegisterRequest {
    private String fullname;
    private String email;
    private String password;
    private String country;

    // Construtor vazio
    public RegisterRequest() {}

    // Construtor completo
    public RegisterRequest(String fullname, String email, String password) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
    }

    // Getters e Setters

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
