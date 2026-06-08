// controller/UsuarioController.java
package com.bioyachay.backend.controller;

import com.bioyachay.backend.entity.Usuario;
import com.bioyachay.backend.entity.ProgresoModulo;
import com.bioyachay.backend.repository.UsuarioRepository;
import com.bioyachay.backend.repository.ProgresoModuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepo;
    private final ProgresoModuloRepository progresoRepo;

    // POST /api/usuarios
    @PostMapping
    public Usuario crear(@RequestBody Usuario u) {
        return usuarioRepo.save(u);
    }

    // GET /api/usuarios/1
    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable Integer id) {
        return usuarioRepo.findById(id).orElseThrow();
    }

    // GET /api/usuarios/1/progreso
    @GetMapping("/{id}/progreso")
    public List<ProgresoModulo> progreso(@PathVariable Integer id) {
        return progresoRepo.findByUsuarioId(id);
    }
}