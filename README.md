# MANSISTEM TICKET MANAGMENT SOFTWARE 

Este sistema esta en desarrollo, por lo cuál puede ser que falten muchas cosas. Igualmente si desea continuar con este proyecto acá dejo un par de indicaciones de como iniciarlo.


### Primeros pasos
#### Instalar dependencias.

```sh
npm install
```
> Esto instalará todas las dependecias requeridas.

#### Crea la base de datos: 
```sql
-- Creamos la base de datoss
CREATE DATABASE IF NOT EXISTS MANSISTEM
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionamos la base de datos para realizar operaciones sobre ella
USE MANSISTEM;

-- Creación de la tabla PROVINCE
CREATE TABLE PROVINCE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
) COMMENT='Tabla de provincias: Almacena las provincias disponibles.';

-- Creación de la tabla USER_ROL
CREATE TABLE USER_ROL (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
) COMMENT='Tabla de roles de usuario: Define los diferentes roles de usuario en el sistema.';

-- Creación de la tabla STATUS
CREATE TABLE STATUS (
    id INT PRIMARY KEY,
    info CHAR(12) UNIQUE NOT NULL
) COMMENT='Tabla de estados: Almacena los estados posibles como habilitado o inhabilitado.';

-- Creación de la tabla USER
CREATE TABLE USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    province_id INT NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (role_id) REFERENCES USER_ROL(id),
    FOREIGN KEY (province_id) REFERENCES PROVINCE(id),
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) COMMENT='Tabla de usuarios: Almacena información de los usuarios del sistema.';

-- Creación de la tabla CLIENT
CREATE TABLE CLIENT (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    province_id INT NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (province_id) REFERENCES PROVINCE(id),
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) COMMENT='Tabla de clientes: Almacena información de los clientes.';

-- Creación de la tabla TICKET_AREA
CREATE TABLE TICKET_AREA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
) COMMENT='Tabla de áreas de tickets: Define las áreas a las que pueden pertenecer los tickets.';

-- Creación de la tabla TICKET_STATUS
CREATE TABLE TICKET_STATUS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    info CHAR(12) UNIQUE NOT NULL
) COMMENT='Tabla de estados de tickets: Almacena los estados posibles de un ticket.';

-- Creación de la tabla TICKET_TYPE
CREATE TABLE TICKET_TYPE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    info CHAR(12) UNIQUE NOT NULL
) COMMENT='Tabla de tipos de tickets: Define los tipos de tickets.';

-- Creación de la tabla TICKET
CREATE TABLE TICKET (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket_client INT NOT NULL,
    client_id INT NOT NULL,
    device_user VARCHAR(60),
    info VARCHAR(500),
    ticket_area_id INT NOT NULL,
    ticket_status_id INT DEFAULT 1 NOT NULL,
    ticket_type_id INT NOT NULL,
    assigned_to_user_id INT NOT NULL,
    assigned_by_user_id INT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    close_date TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(id),
    FOREIGN KEY (ticket_area_id) REFERENCES TICKET_AREA(id),
    FOREIGN KEY (ticket_status_id) REFERENCES TICKET_STATUS(id),
    FOREIGN KEY (ticket_type_id) REFERENCES TICKET_TYPE(id),
    FOREIGN KEY (assigned_to_user_id) REFERENCES USER(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES USER(id)
) COMMENT='Tabla de tickets: Almacena los tickets generados en el sistema.';

-- Creación de la tabla DEVICE_CLASS
CREATE TABLE DEVICE_CLASS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) COMMENT='Tabla de clases de dispositivos: Clasifica los dispositivos en diferentes categorías.';

-- Creación de la tabla DEVICE_SUPPLIER
CREATE TABLE DEVICE_SUPPLIER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) COMMENT='Tabla de proveedores de dispositivos: Almacena información sobre los proveedores de dispositivos.';

-- Creación de la tabla DEVICE_TYPE
CREATE TABLE DEVICE_TYPE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    device_class_id INT NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    UNIQUE (name, device_class_id),
    FOREIGN KEY (device_class_id) REFERENCES DEVICE_CLASS(id),
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) COMMENT='Tabla de tipos de dispositivos: Define los tipos de dispositivos dentro de cada clase.';

-- Creación de la tabla DEVICE
CREATE TABLE DEVICE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(20) NOT NULL,
    device_class_id INT NOT NULL,
    device_type_id INT NOT NULL,
    device_supplier_id INT NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    UNIQUE (model, device_class_id, device_type_id, device_supplier_id),
    FOREIGN KEY (device_class_id) REFERENCES DEVICE_CLASS(id),
    FOREIGN KEY (device_type_id) REFERENCES DEVICE_TYPE(id),
    FOREIGN KEY (device_supplier_id) REFERENCES DEVICE_SUPPLIER(id),
    FOREIGN KEY (status_id) REFERENCES STATUS(id)
) COMMENT='Tabla de dispositivos: Almacena información específica de cada dispositivo.';


INSERT INTO USER_ROL (name)
SELECT 'ADMIN' UNION
SELECT 'COORDINADOR' UNION
SELECT 'TÉCNICO'
WHERE NOT EXISTS (
  SELECT *
  FROM USER_ROL
  WHERE name IN ('ADMIN', 'COORDINADOR', 'TÉCNICO')
);

INSERT INTO STATUS (id, info)
SELECT 1, 'HABILITADO' UNION
SELECT 0, 'INHABILITADO'
WHERE NOT EXISTS (
  SELECT *
  FROM STATUS
  WHERE id IN (0, 1)
);

INSERT INTO PROVINCE (name)
SELECT 'SAN JOSÉ' UNION
SELECT 'ALAJUELA' UNION
SELECT 'CARTAGO' UNION
SELECT 'HEREDIA' UNION
SELECT 'GUANACASTE' UNION
SELECT 'PUNTARENAS' UNION
SELECT 'LIMÓN'
WHERE NOT EXISTS (
  SELECT *
  FROM PROVINCE
  WHERE name IN ('SAN JOSÉ', 'ALAJUELA', 'CARTAGO', 'HEREDIA', 'GUANACASTE', 'PUNTARENAS', 'LIMÓN')
);

INSERT INTO TICKET_AREA (name)
SELECT 'ADMINISTRATIVOS' UNION
SELECT 'GERENCIA' UNION
SELECT 'CAJAS' UNION
SELECT 'CARNICERIA'
WHERE NOT EXISTS (
  SELECT *
  FROM TICKET_AREA
  WHERE name IN ('ADMINISTRATIVOS', 'GERENCIA', 'CAJAS', 'CARNICERIA')
);

INSERT INTO TICKET_TYPE (info)
SELECT 'SOPORTE' UNION
SELECT 'PREVENTIVO' UNION
SELECT 'CORRECTIVO' UNION
SELECT 'DIAGNÓSTICO'
WHERE NOT EXISTS (
  SELECT *
  FROM TICKET_TYPE
  WHERE info IN ('SOPORTE', 'PREVENTIVO', 'CORRECTIVO', 'DIAGNÓSTICO')
);

INSERT INTO TICKET_STATUS (info)
SELECT 'ABIERTO' UNION
SELECT 'EN ESPERA' UNION
SELECT 'EN CURSO' UNION
SELECT 'SOLUCIONADO' UNION
SELECT 'CERRADO'
WHERE NOT EXISTS (
  SELECT *
  FROM TICKET_STATUS
  WHERE info IN ('ABIERTO', 'EN ESPERA', 'EN CURSO', 'SOLUCIONADO', 'CERRADO')
);

-- Usuario de prueba.
INSERT INTO USER (name, last_name, username, email, password, role_id, province_id)
SELECT 'JUST FOR', 'TEST USER', 'utest', 'u@test.com', '$2a$10$h7aOmyhOOUBpPBaHt7.TyOMwzoza3mDv/vcjpc.ziuAXjgjgfaFZm', 1, 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT *
  FROM USER
  WHERE id = 1
);
```
> Nota: Se está utilizando MYSQL. \
> Puedes revisar la documentación de esta base de datos en: [dbdocs.io](https://dbdocs.io/MilfuegosDEV/mansistem-query)

#### Configura variables de entorno.

Primero crea un archivo dentro de la raíz del proyecto que se llame `.env` y copia lo siguiente:

``` conf
# BASIC EXPRESS CONFIG
PORT = 3000
SESSION_SECRET = your_session_secret
COOKIE_SECRET = your_cookie_secret

# DB CREDENTIALS
DATABASE_SERVER = your_host
DATABASE_USER = your_user
DATABASE_PASSWORD = your_password
DATABASE_NAME = schema_name
```
> Reemplaza los valores, por tú configuración.

### Iniciar a la plataforma.
![Usuario de prueba](assets\first_user.png)

> Este usuario es administrador. Además tiene todos los privilegios, puede crear nuevos usuarios, clientes Y dispositivos.


### Desarrollado por: [MILFUEGOSDEV]('https://github.com/milfuegosdev') 

#### Información de contacto: 
Correo: [milfuegosdev]('mailto:milfuegosdev@gmailc.om')
