package com.bioyachay.backend.repository;

import com.bioyachay.backend.entity.ProgresoModulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgresoModuloRepository extends JpaRepository<ProgresoModulo, Integer> {
    List<ProgresoModulo> findByUsuarioId(Integer usuarioId);
}
