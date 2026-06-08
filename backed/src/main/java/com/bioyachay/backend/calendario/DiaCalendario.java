// scheduler/JuegoDiaScheduler.java
package com.bioyachay.backend.calendario;

import com.bioyachay.backend.entity.JuegoDia;
import com.bioyachay.backend.entity.Modulo;
import com.bioyachay.backend.repository.JuegodiaRepository;
import com.bioyachay.backend.repository.ModuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class DiaCalendario {

    private final JuegodiaRepository juegoDiaRepo;
    private final ModuloRepository   moduloRepo;

    // Se ejecuta todos los días a medianoche (00:00)
    @Scheduled(cron = "0 0 0 * * *")
    public void rotarJuegosDelDia() {
        LocalDate hoy = LocalDate.now();
        List<Modulo> modulos = moduloRepo.findAll();

        for (Modulo modulo : modulos) {
            // Desactivar el juego anterior
            juegoDiaRepo.findByModuloClaveAndFecha(modulo.getClave(), hoy.minusDays(1))
                .ifPresent(juego -> {
                    juego.setActivo(false);
                    juegoDiaRepo.save(juego);
                });

            // Crear el juego del día de hoy si no existe
            boolean yaExiste = juegoDiaRepo
                .findByModuloClaveAndFecha(modulo.getClave(), hoy)
                .isPresent();

            if (!yaExiste) {
                JuegoDia nuevo = new JuegoDia();
                nuevo.setModulo(modulo);
                nuevo.setFecha(hoy);
                nuevo.setActivo(true);
                juegoDiaRepo.save(nuevo);
            }
        }
    }

    // También crea los juegos del día al arrancar el servidor
    @Scheduled(initialDelay = 1000, fixedDelay = Long.MAX_VALUE)
    public void crearJuegosAlArrancar() {
        rotarJuegosDelDia();
    }
}