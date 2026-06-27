package com.bioyachay.backend.service;

import com.bioyachay.backend.dto.AuthResponse;
import com.bioyachay.backend.dto.LoginRequest;
import com.bioyachay.backend.dto.RegisterRequest;
import com.bioyachay.backend.entity.Usuario;
import com.bioyachay.backend.repository.UsuarioRepository;
import com.bioyachay.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
        this.jwtUtil           = jwtUtil;
    }

    // ─── Registro ─────────────────────────────────────────────────────────────
    public AuthResponse register(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        if (usuarioRepository.existsByDni(req.getDni())) {
            throw new IllegalArgumentException("El DNI ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(req.getNombre().trim());
        usuario.setEmail(req.getEmail().toLowerCase().trim());
        usuario.setDni(req.getDni().trim());
        usuario.setPassword(passwordEncoder.encode(req.getPassword()));

        Usuario saved = usuarioRepository.save(usuario);
        String token  = jwtUtil.generateToken(saved.getEmail(), saved.getId());

        return new AuthResponse(token, saved.getId(), saved.getNombre(),
                                saved.getEmail(), saved.getAvatarColor());
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(req.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Credenciales incorrectas");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId());

        return new AuthResponse(token, usuario.getId(), usuario.getNombre(),
                                usuario.getEmail(), usuario.getAvatarColor());
    }
}
