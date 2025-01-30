//package com.personalphotomap.controller;
//
//import com.personalphotomap.model.AppUser;
//import com.personalphotomap.model.Event;
//import com.personalphotomap.service.EventService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/events")
//public class EventController {
//
//    @Autowired
//    private EventService eventService;
//
//    // Cria um novo evento
//    @PostMapping
//    public ResponseEntity<Event> createEvent(@RequestBody Event event, @RequestParam Long userId) {
//        AppUser user = new AppUser(); // Troque para obter o usuário real usando autenticação
//        user.setId(userId);
//        Event createdEvent = eventService.createEvent(event, user);
//        return ResponseEntity.ok(createdEvent);
//    }
//
//    // Busca eventos por countryId e year
//    @GetMapping("/{countryId}/{year}")
//    public ResponseEntity<List<Event>> getEventsByCountryAndYear(
//            @PathVariable String countryId, @PathVariable int year) {
//        List<Event> events = eventService.getEventsByCountryAndYear(countryId, year);
//        return ResponseEntity.ok(events);
//    }
//
//    // Conta eventos por usuário e país
//    @GetMapping("/count/{userId}/{countryId}")
//    public ResponseEntity<Long> countEventsByUserAndCountry(
//            @PathVariable Long userId, @PathVariable String countryId) {
//        long count = eventService.countEventsByUserAndCountry(userId, countryId);
//        return ResponseEntity.ok(count);
//    }
//
//    // Busca anos distintos de eventos para um usuário em um país
//    @GetMapping("/distinct-years/{countryId}/{userId}")
//    public ResponseEntity<List<Integer>> findDistinctYearsByCountryIdAndUserId(
//            @PathVariable String countryId, @PathVariable Long userId) {
//        List<Integer> years = eventService.findDistinctYearsByCountryIdAndUserId(countryId, userId);
//        return ResponseEntity.ok(years);
//    }
//
//    // Outros endpoints para atualizar e deletar eventos
//    @PutMapping("/{eventId}")
//    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
//        Optional<Event> existingEvent = eventService.getEventById(eventId);
//
//        if (existingEvent.isPresent()) {
//            Event event = existingEvent.get();
//            event.setEventName(updatedEvent.getEventName());
//            event.setCountryId(updatedEvent.getCountryId());
//            event.setYear(updatedEvent.getYear());
//
//            Event savedEvent = eventService.updateEvent(event);
//            return ResponseEntity.ok(savedEvent);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @DeleteMapping("/{eventId}")
//    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
//        eventService.deleteEvent(eventId);
//        return ResponseEntity.noContent().build();
//    }
//}
