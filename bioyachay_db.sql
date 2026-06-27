
CREATE DATABASE IF NOT EXISTS bioyachay
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bioyachay;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id           INT          NOT NULL AUTO_INCREMENT,
    nombre       VARCHAR(100) NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    dni          VARCHAR(20)  NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    avatar_color VARCHAR(7)   DEFAULT '#3178b2',
    creado_en    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de módulos
CREATE TABLE IF NOT EXISTS modulos (
    id     INT         NOT NULL AUTO_INCREMENT,
    clave  VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales de módulos
INSERT IGNORE INTO modulos (clave, nombre) VALUES
    ('memoria',       'Juego de Memoria'),
    ('coordinacion',  'Atrapa las Frutas'),
    ('razonamiento',  'Juego de Suma'),
    ('atencion',      'Juego de Atención'),
    ('visoespacial',  'Encaja las Formas'),
    ('cognitivas',    'Funciones Cognitivas');

-- Tabla de progreso por módulo
CREATE TABLE IF NOT EXISTS progreso_modulo (
    id               INT            NOT NULL AUTO_INCREMENT,
    usuario_id       INT            NOT NULL,
    modulo_id        INT            NOT NULL,
    porcentaje       DECIMAL(5,2)   DEFAULT 0.00,
    dias_completados INT            DEFAULT 0,
    actualizado_en   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (modulo_id)  REFERENCES modulos(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de sesiones de juego
CREATE TABLE IF NOT EXISTS sesiones_juego (
    id         BIGINT   NOT NULL AUTO_INCREMENT,
    usuario_id INT      NOT NULL,
    modulo_id  INT      NOT NULL,
    aciertos   INT      DEFAULT 0,
    fallos     INT      DEFAULT 0,
    completado TINYINT(1) DEFAULT 0,
    jugado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (modulo_id)  REFERENCES modulos(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
