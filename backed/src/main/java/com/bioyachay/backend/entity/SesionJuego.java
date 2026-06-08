package com.bioyachay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity @Data @NoArgsConstructor
public class SesionJuego {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @ManyToOne @JoinColumn(name = "juego_dia_id")
    private JuegoDia juegoDia;
    private Integer aciertos  = 0;
    private Integer fallos    = 0;
    private Boolean completado = false;
    private LocalDateTime jugadoEn = LocalDateTime.now();
}