package com.bioyachay.backend.repository;
import com.bioyachay.backend.entity.SesionJuego;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface SesionJuegoRepository extends JpaRepository<SesionJuego, Long> {
    List<SesionJuego> findByUsuarioId(Integer usuarioId);
    // Verifica si el usuario ya jugó hoy este módulo
    Optional<SesionJuego> findByUsuarioIdAndJuegoDiaId(Integer usuarioId, Integer juegoDiaId);
}