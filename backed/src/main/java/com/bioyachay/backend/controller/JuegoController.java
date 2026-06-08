// controller/JuegoController.java
package com.bioyachay.backend.controller;

import com.bioyachay.backend.entity.JuegoDia;
import com.bioyachay.backend.entity.ProgresoModulo;
import com.bioyachay.backend.repository.JuegodiaRepository;
import com.bioyachay.backend.service.ProgresoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/juego")
@RequiredArgsConstructor
public class JuegoController {

    private final ProgresoService    progresoService;
    private final JuegodiaRepository juegoDiaRepo;

    // POST /api/juego/sesion
    // Body: { "usuarioId":1, "moduloClave":"memoria", "aciertos":8, "fallos":2, "completado":true }
    @PostMapping("/sesion")
    public ProgresoModulo guardarSesion(@RequestBody SesionRequest req) {
        return progresoService.guardarSesion(
            req.usuarioId(), req.moduloClave(),
            req.aciertos(), req.fallos(), req.completado()
        );
    }

    // GET /api/juego/activo/memoria
    @GetMapping("/activo/{clave}")
    public JuegoDia juegoActivo(@PathVariable String clave) {
        return juegoDiaRepo
            .findByModuloClaveAndFecha(clave, LocalDate.now())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "No hay juego activo hoy para: " + clave));
    }
}

record SesionRequest(Integer usuarioId, String moduloClave,
                     int aciertos, int fallos, boolean completado) {}