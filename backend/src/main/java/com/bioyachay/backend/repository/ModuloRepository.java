package com.bioyachay.backend.repository;

import com.bioyachay.backend.entity.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {
    Optional<Modulo> findByClave(String clave);
}
