const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Configuración middleware
app.use(express.json());
app.use(express.static(__dirname));

// Conexión a MySQL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "mi_base",
});

// Ruta principal index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/alta", (req, res) => {
    res.sendFile(path.join(__dirname, "alta.html"));
});
app.get("/consulta", (req, res) => {
    res.sendFile(path.join(__dirname, "consulta.html"));
});

// Ruta para procesar el login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validar si el usuario existe
        const [users] = await pool.query(
            "SELECT * FROM usuarios WHERE username = ?",
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: "Usuario no existe" });
        }

        const user = users[0];

        // Comparar la contraseña encriptada
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Redirigir según el rol del usuario
        const redirectURL =
            user.role === "admin"
                ? "/admin_dashboard.html"
                : "/employee_dashboard.html";

        res.json({ success: true, redirect: redirectURL });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

//Ruta para formulario de empleados
app.get("/empleados", (req, res) => {
    const query =
        "SELECT id, nombre, email, puesto, fechaNacimiento, curp, rfc, nss, tipoContrato, genero FROM empleados";
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error al consultar empleados:", error);
            return res.status(500).json({ error: "Error al obtener empleados" });
        }
        res.json(results);
    });
});

//Ruta para deletear usuarios
app.delete("/empleados/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM empleados where id = ?";
    connection.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).send("Ha habido un error");
        } else {
            res.status(200).send("Empleado eliminado correctamente");
        }
    });
});

// Ruta de registro de empleados
app.post("/register", (req, res) => {
    const {
        nombre,
        email,
        puesto,
        fechaNacimiento,
        documentosEntregados,
        genero,
        tipoContrato,
    } = req.body;

    if (
        !nombre ||
        !email ||
        !puesto ||
        !fechaNacimiento ||
        !documentosEntregados ||
        !genero ||
        !tipoContrato
    ) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    const curp = documentosEntregados.curp ? "Si" : "No";
    const rfc = documentosEntregados.rfc ? "Si" : "No";
    const nss = documentosEntregados.nss ? "Si" : "No";
    const formattedFechaNacimiento = new Date(fechaNacimiento)
        .toISOString()
        .split("T")[0];

    const query =
        "INSERT INTO empleados (nombre, email, puesto, fechaNacimiento, curp, rfc,nss, genero, tipoContrato) VALUES (?, ?, ?, ?,?,?,?,?,?)";

    connection.execute(
        query,
        [
            nombre,
            email,
            puesto,
            formattedFechaNacimiento,
            curp,
            rfc,
            nss,
            genero,
            tipoContrato,
        ],
        (error, results) => {
            if (error) {
                console.error("Error al insertar en la base de datos:", error);
                return res.status(500).send("Error al registrar empleado");
            }
            res.status(201).send("Empleado registrado correctamente");
        }
    );
});

//dashboard para empleados
app.get("/employee_dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "employee_dashboard.html"));
});

// Dashboard para admin
app.get("/admin_dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "admin_dashboard.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});
