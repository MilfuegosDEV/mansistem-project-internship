-- Creamos la base de datos
CREATE DATABASE IF NOT EXISTS MANSISTEM
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionamos la base de datos para realizar operaciones sobre ella
USE MANSISTEM;

-- Creamos la tabla 'provinces'
CREATE TABLE PROVINCE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE USER_ROL (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO USER_ROL (name) VALUES 
	('Admin'),
    ('Técnico'),
    ('Soporte');

-- Insertamos datos en la tabla 'provinces'
INSERT INTO PROVINCE (name) VALUES 
    ('San José'),
    ('Alajuela'),
    ('Cartago'),
    ('Heredia'),
    ('Guanacaste'),
    ('Puntarenas'),
    ('Limón');
    


-- Creamos la tabla 'users'
CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- espacio aumentado por si se utiliza hash de contraseña
    role_id INT NOT NULL,
    province_id INT NOT NULL,
    status ENUM ('HABILITADO','DESHABILITADO') DEFAULT 'HABILITADO' NOT NULL,
    FOREIGN KEY (province_id) REFERENCES PROVINCE(id),
	FOREIGN KEY (role_id) REFERENCES USER_ROL(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
