package com.bioyachay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sesiones_juego")
@Data
@NoArgsConstructor
public class SesionJuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    private Integer aciertos = 0;
    private Integer fallos = 0;
    private Boolean completado = false;
    private LocalDateTime jugadoEn = LocalDateTime.now();
}
