package com.bioyachay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity @Data @NoArgsConstructor
public class JuegoDia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "modulo_id")
    private Modulo modulo;
    private LocalDate fecha;
    private Boolean activo = true;
}