//package com.personalphotomap.model;
//
//import jakarta.persistence.*;
//import java.util.List;
//
//@Entity
//@Table(name = "events")
//public class Event {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String eventName;
//
//    private String countryId;
//
//    private int year;
//
//    // Relacionamento Many-to-One com AppUser (um usuário pode ter muitos eventos)
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private AppUser user;
//
//    // Relacionamento One-to-Many com Image (um evento pode ter muitas imagens)
//    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Image> images;
//
//    // Construtor vazio
//    public Event() {
//    }
//
//    // Getters e Setters
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getEventName() {
//        return eventName;
//    }
//
//    public void setEventName(String eventName) {
//        this.eventName = eventName;
//    }
//
//    public String getCountryId() {
//        return countryId;
//    }
//
//    public void setCountryId(String countryId) {
//        this.countryId = countryId;
//    }
//
//    public int getYear() {
//        return year;
//    }
//
//    public void setYear(int year) {
//        this.year = year;
//    }
//
//    public AppUser getUser() {
//        return user;
//    }
//
//    public void setUser(AppUser user) {
//        this.user = user;
//    }
//
//    public List<Image> getImages() {
//        return images;
//    }
//
//    public void setImages(List<Image> images) {
//        this.images = images;
//    }
//}
