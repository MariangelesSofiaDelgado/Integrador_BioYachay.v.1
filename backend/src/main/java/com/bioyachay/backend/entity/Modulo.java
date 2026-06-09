package com.bioyachay.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "modulos")
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 50)
    private String clave;

    @Column(nullable = false, length = 100)
    private String nombre;

    public Integer getId()           { return id; }
    public String  getClave()        { return clave; }
    public String  getNombre()       { return nombre; }

    public void setId(Integer id)    { this.id = id; }
    public void setClave(String c)   { this.clave = c; }
    public void setNombre(String n)  { this.nombre = n; }
}