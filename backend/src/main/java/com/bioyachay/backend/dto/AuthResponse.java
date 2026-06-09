package com.bioyachay.backend.dto;

public class AuthResponse {
    private String  token;
    private Integer id;
    private String  nombre;
    private String  email;
    private String  avatarColor;

    public AuthResponse(String token, Integer id, String nombre,
                        String email, String avatarColor) {
        this.token       = token;
        this.id          = id;
        this.nombre      = nombre;
        this.email       = email;
        this.avatarColor = avatarColor;
    }

    public String  getToken()       { return token; }
    public Integer getId()          { return id; }
    public String  getNombre()      { return nombre; }
    public String  getEmail()       { return email; }
    public String  getAvatarColor() { return avatarColor; }
}