package com.personalphotomap.repository;

import com.personalphotomap.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    // Buscar todas as imagens de um país
    List<Image> findByCountryId(String countryId);

    // Método para contar o número de fotos do usuário
    @Query("SELECT COUNT(i) FROM Image i WHERE i.email = :email")
    long countByEmail(@Param("email") String email);



    List<Image> findByCountryIdAndYear(String countryId, int year);
    List<Image> findByEmail(String email);

    List<Image> findByCountryIdAndEmail(String countryId, String email);

    List<Image> findByCountryIdAndYearAndEmail(String countryId, int year, String email);


    List<Image> findByEmailOrderByUploadDateDesc(String email);

    @Query("SELECT DISTINCT i.countryId FROM Image i WHERE i.email = :email")
    List<String> findDistinctCountryIdsByEmail(@Param("email") String email);

    @Query("SELECT i FROM Image i ORDER BY i.uploadDate DESC")
    List<Image> findAllOrderedByUploadDateDesc();

    // Buscar anos distintos em que um usuário enviou imagens para um determinado país
    @Query("SELECT DISTINCT i.year FROM Image i WHERE i.countryId = :countryId AND i.email = :email ORDER BY i.year")
    List<Integer> findDistinctYearsByCountryIdAndEmail(@Param("countryId") String countryId, @Param("email") String email);
    // Método para contar o número de países distintos onde o usuário tem fotos
    @Query("SELECT COUNT(DISTINCT i.countryId) FROM Image i WHERE i.email = :email")
    long countDistinctCountryByEmail(@Param("email") String email);
}
