// repository/ProgresoModuloRepository.java
package com.bioyachay.backend.repository;
import com.bioyachay.backend.entity.ProgresoModulo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ProgresoModuloRepository extends JpaRepository<ProgresoModulo, Integer> {
    List<ProgresoModulo> findByUsuarioId(Integer usuarioId);
    Optional<ProgresoModulo> findByUsuarioIdAndModuloId(Integer usuarioId, Integer moduloId);
}