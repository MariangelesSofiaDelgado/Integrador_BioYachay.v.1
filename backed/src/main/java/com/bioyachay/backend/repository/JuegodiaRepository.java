package com.bioyachay.backend.repository;
import com.bioyachay.backend.entity.JuegoDia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
public interface JuegodiaRepository extends JpaRepository<JuegoDia, Integer> {
    // Juego activo de hoy para un módulo
    Optional<JuegoDia> findByModuloClaveAndFecha(String clave, LocalDate fecha);
}