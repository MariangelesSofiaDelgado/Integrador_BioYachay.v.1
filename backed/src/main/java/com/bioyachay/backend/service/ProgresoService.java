// service/ProgresoService.java
package com.bioyachay.backend.service;

import com.bioyachay.backend.entity.*;
import com.bioyachay.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service @RequiredArgsConstructor
public class ProgresoService {

    private final SesionJuegoRepository  sesionRepo;
    private final ProgresoModuloRepository progresoRepo;
    private final JuegodiaRepository     juegoDiaRepo;
    private final UsuarioRepository      usuarioRepo;

    @Transactional
    public ProgresoModulo guardarSesion(Integer usuarioId, String moduloClave,
                                        int aciertos, int fallos, boolean completado) {
        // 1. Obtener juego activo de hoy
        JuegoDia juego = juegoDiaRepo
            .findByModuloClaveAndFecha(moduloClave, LocalDate.now())
            .orElseThrow(() -> new RuntimeException("No hay juego activo hoy para: " + moduloClave));

        Usuario usuario = usuarioRepo.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + usuarioId));

        // 2. Evitar doble registro del mismo día
        boolean yaJugoHoy = sesionRepo
            .findByUsuarioIdAndJuegoDiaId(usuarioId, juego.getId())
            .isPresent();
        if (yaJugoHoy) {
            // Devolver el progreso actual sin modificar
            return progresoRepo.findByUsuarioIdAndModuloId(usuarioId, juego.getModulo().getId())
                .orElseThrow();
        }

        // 3. Guardar sesión
        SesionJuego sesion = new SesionJuego();
        sesion.setUsuario(usuario);
        sesion.setJuegoDia(juego);
        sesion.setAciertos(aciertos);
        sesion.setFallos(fallos);
        sesion.setCompletado(completado);
        sesionRepo.save(sesion);

        // 4. Actualizar progreso solo si completó el juego
        ProgresoModulo progreso = progresoRepo
            .findByUsuarioIdAndModuloId(usuarioId, juego.getModulo().getId())
            .orElseGet(() -> {
                ProgresoModulo p = new ProgresoModulo();
                p.setUsuario(usuario);
                p.setModulo(juego.getModulo());
                return p;
            });

        if (completado) {
            // Sube la barra: promedio de precisión de sesiones completadas
            int diasCompletados = progreso.getDiasCompletados() + 1;
            progreso.setDiasCompletados(diasCompletados);

            int total = aciertos + fallos;
            double precision = total > 0 ? (aciertos * 100.0 / total) : 100.0;

            // Promedio acumulado ponderado
            double promedioActual = progreso.getPorcentaje().doubleValue();
            double nuevoPorcentaje = ((promedioActual * (diasCompletados - 1)) + precision) / diasCompletados;
            // Tope máximo de 100%
            nuevoPorcentaje = Math.min(nuevoPorcentaje, 100.0);

            progreso.setPorcentaje(
                BigDecimal.valueOf(nuevoPorcentaje).setScale(2, RoundingMode.HALF_UP)
            );
        }

        return progresoRepo.save(progreso);
    }
}