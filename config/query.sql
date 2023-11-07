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

CREATE TABLE IF NOT EXISTS STATUS (
	id INT PRIMARY KEY,
    info CHAR(12) UNIQUE NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO USER_ROL (name) VALUES 
	('Admin'),
    ('Técnico'),
    ('Soporte');


INSERT INTO STATUS(id, info) VALUES 
	(1,'HABILITADO'),
    (0,'INHABILITADO');
    

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
    status_id INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (province_id) REFERENCES PROVINCE(id),
	FOREIGN KEY (role_id) REFERENCES USER_ROL(id),
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS CLIENT (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(8) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    province_id INT NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
	FOREIGN KEY (province_id) REFERENCES PROVINCE(id),
	FOREIGN KEY (status_id) REFERENCES STATUS(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
