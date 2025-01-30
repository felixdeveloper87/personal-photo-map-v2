package com.personalphotomap.repository;

import com.personalphotomap.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {

    // Se você precisar buscar por email também, você pode adicionar este método:
    AppUser findByEmail(String email);
}
