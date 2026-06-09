package com.bioyachay.backend.repository;

import com.bioyachay.backend.entity.SesionJuego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SesionJuegoRepository extends JpaRepository<SesionJuego, Long> {
    List<SesionJuego> findByUsuarioIdOrderByJugadoEnDesc(Integer usuarioId);
}
