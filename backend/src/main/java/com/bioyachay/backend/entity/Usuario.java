package com.bioyachay.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false, length = 20)
    private String dni;

    @Column(nullable = false)
    private String password;

    @Column(length = 7)
    private String avatarColor = "#3178b2";

    @Column(nullable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();

    public Integer getId()                    { return id; }
    public String  getEmail()                 { return email; }
    public String  getNombre()                { return nombre; }
    public String  getDni()                   { return dni; }
    public String  getPassword()              { return password; }
    public String  getAvatarColor()           { return avatarColor; }
    public LocalDateTime getCreadoEn()        { return creadoEn; }

    public void setId(Integer id)             { this.id = id; }
    public void setEmail(String email)        { this.email = email; }
    public void setNombre(String nombre)      { this.nombre = nombre; }
    public void setDni(String dni)            { this.dni = dni; }
    public void setPassword(String password)  { this.password = password; }
    public void setAvatarColor(String c)      { this.avatarColor = c; }
    public void setCreadoEn(LocalDateTime t)  { this.creadoEn = t; }
}