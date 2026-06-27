package com.bioyachay.backend.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email no válido")
    private String email;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^[0-9]{8}$", message = "El DNI debe tener 8 dígitos")
    private String dni;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 100)
    private String password;

    public String getNombre()              { return nombre; }
    public String getEmail()               { return email; }
    public String getDni()                 { return dni; }
    public String getPassword()            { return password; }

    public void setNombre(String nombre)   { this.nombre = nombre; }
    public void setEmail(String email)     { this.email = email; }
    public void setDni(String dni)         { this.dni = dni; }
    public void setPassword(String p)      { this.password = p; }
}