package com.bioyachay.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email no válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    public String getEmail()              { return email; }
    public String getPassword()           { return password; }

    public void setEmail(String email)    { this.email = email; }
    public void setPassword(String p)     { this.password = p; }
}