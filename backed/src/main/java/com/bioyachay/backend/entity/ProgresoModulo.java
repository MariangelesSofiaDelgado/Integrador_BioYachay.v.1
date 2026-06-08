package com.bioyachay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Data @NoArgsConstructor
public class ProgresoModulo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @ManyToOne @JoinColumn(name = "modulo_id")
    private Modulo modulo;
    private BigDecimal porcentaje    = BigDecimal.ZERO;
    private Integer diasCompletados  = 0;
    private LocalDateTime actualizadoEn = LocalDateTime.now();
}