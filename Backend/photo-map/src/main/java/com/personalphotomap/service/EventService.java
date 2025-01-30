//package com.personalphotomap.service;
//
//import com.personalphotomap.model.AppUser;
//import com.personalphotomap.model.Event;
//import com.personalphotomap.repository.EventRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class EventService {
//
//    @Autowired
//    private EventRepository eventRepository;
//
//    // Criação de um evento associando o usuário
//    public Event createEvent(Event event, AppUser user) {
//        event.setUser(user);
//        return eventRepository.save(event);
//    }
//
//    // Busca eventos por país e ano
//    public List<Event> getEventsByCountryAndYear(String countryId, int year) {
//        return eventRepository.findByCountryIdAndYear(countryId, year);
//    }
//
//    // Conta o número de eventos para um usuário em um país específico
//    public long countEventsByUserAndCountry(Long userId, String countryId) {
//        return eventRepository.countEventsByUserAndCountry(userId, countryId);
//    }
//
//    // Busca anos distintos de eventos para um usuário em um país
//    public List<Integer> findDistinctYearsByCountryIdAndUserId(String countryId, Long userId) {
//        return eventRepository.findDistinctYearsByCountryIdAndUserId(countryId, userId);
//    }
//
//    // Outros métodos de serviço
//    public Optional<Event> getEventById(Long id) {
//        return eventRepository.findById(id);
//    }
//
//    public Event updateEvent(Event event) {
//        return eventRepository.save(event);
//    }
//
//    public void deleteEvent(Long eventId) {
//        eventRepository.deleteById(eventId);
//    }
//}
