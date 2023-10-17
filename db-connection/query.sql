-- Eliminamos la base de datos si existe
DROP DATABASE IF EXISTS mansistem;

-- Creamos la base de datos
CREATE DATABASE IF NOT EXISTS mansistem
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionamos la base de datos para realizar operaciones sobre ella
USE mansistem;

-- Creamos la tabla 'provinces'
CREATE TABLE provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

-- Insertamos datos en la tabla 'provinces'
INSERT INTO provinces (name) VALUES 
    ('San José'),
    ('Alajuela'),
    ('Cartago'),
    ('Heredia'),
    ('Guanacaste'),
    ('Puntarenas'),
    ('Limón');

-- Creamos la tabla 'users'
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    lastname VARCHAR(60) NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- espacio aumentado por si se utiliza hash de contraseña
    role ENUM('admin', 'user', 'guest') NOT NULL, -- suponiendo que estos son los roles posibles
    province_id INT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleccionamos todos los datos de la tabla 'users'
SELECT * FROM users;
