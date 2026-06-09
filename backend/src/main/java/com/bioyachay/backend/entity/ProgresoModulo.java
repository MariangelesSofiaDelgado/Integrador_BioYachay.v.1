package com.bioyachay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "progreso_modulo")
@Data
@NoArgsConstructor
public class ProgresoModulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    @Column(precision = 5, scale = 2)
    private BigDecimal porcentaje = BigDecimal.ZERO;

    private Integer diasCompletados = 0;

    private LocalDateTime actualizadoEn = LocalDateTime.now();
}
