package com.bioyachay.backend.repository;
import com.bioyachay.backend.entity.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {
    Optional<Modulo> findByClave(String clave);
}