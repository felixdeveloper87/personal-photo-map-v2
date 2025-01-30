//package com.personalphotomap.repository;
//
//import com.personalphotomap.model.Event;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//
//@Repository
//public interface EventRepository extends JpaRepository<Event, Long> {
//
//    // Buscar eventos por país e ano (usando convenção de nomenclatura)
//    List<Event> findByCountryIdAndYear(String countryId, int year);
//
//    // Buscar todos os eventos de um usuário específico
//    List<Event> findByUserId(Long userId);
//
//    // Buscar eventos por usuário, país e ano
//    List<Event> findByUserIdAndCountryIdAndYear(Long userId, String countryId, int year);
//
//    // Consulta para contar o número de eventos únicos de um usuário em um país específico
//    @Query("SELECT COUNT(e) FROM Event e WHERE e.user.id = :userId AND e.countryId = :countryId")
//    long countEventsByUserAndCountry(@Param("userId") Long userId, @Param("countryId") String countryId);
//
//    // Consulta para obter todos os anos distintos nos quais o usuário criou eventos em um país específico
//    @Query("SELECT DISTINCT e.year FROM Event e WHERE e.countryId = :countryId AND e.user.id = :userId ORDER BY e.year")
//    List<Integer> findDistinctYearsByCountryIdAndUserId(@Param("countryId") String countryId, @Param("userId") Long userId);
//}
