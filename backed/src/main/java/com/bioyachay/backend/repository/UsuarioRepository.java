// repository/UsuarioRepository.java
package com.bioyachay.backend.repository;
import com.bioyachay.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {}