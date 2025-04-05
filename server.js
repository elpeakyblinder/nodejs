const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const path = require("path");
const cors = require("cors");
const session = require('express-session');

const app = express();
const PORT = 3000;

// Configuración middleware
app.use(express.json());
app.use(express.static(__dirname));
// Middleware para permitir cookies cross-origin (por si hace falta en fetch)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Conexión a MySQL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "mi_base",
});

// Middleware de sesión
app.use(session({
    secret: 'clave_super_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Middleware para verificar sesión y rol
function auth(role) {
    return (req, res, next) => {
        console.log('Sesión actual:', req.session.user); // depuración

        if (!req.session.user) {
            return res.status(401).send('No autorizado: inicia sesión');
        }

        if (req.session.user.role !== role) {
            return res.status(403).send('Acceso denegado');
        }

        next();
    };
}

app.use(express.static("public"));
app.use(cors());


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

// Procesar login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Usuario no existe' });
        }

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Regenerar sesión
        req.session.regenerate(err => {
            if (err) {
                console.error('Error al regenerar sesión:', err);
                return res.status(500).json({ error: 'Error en la sesión' });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            console.log('Sesión creada:', req.session.user); // depuración

            const redirectURL = user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
            res.json({ success: true, redirect: redirectURL });
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
// Ruta para obtener empleados
app.get("/empleados", async (req, res) => {
    const query =
        "SELECT id, nombre, email, puesto, fechaNacimiento, curp, rfc, nss, tipoContrato, genero FROM empleados";
    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error("Error al consultar empleados:", error);
        res.status(500).json({ error: "Error al obtener empleados" });
    }
});

//Ruta para actualizar los empleados
app.put("/empleados/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, email, puesto, fechaNacimiento, genero, tipoContrato } = req.body;

    const query = `
        UPDATE empleados 
        SET nombre = ?, email = ?, puesto = ?, fechaNacimiento = ?, genero = ?, tipoContrato = ?
        WHERE id = ?
    `;

    try {
        const [result] = await pool.query(query, [nombre, email, puesto, fechaNacimiento, genero, tipoContrato, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }

        res.json({ success: true, message: "Empleado actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(500).json({ error: "Error al actualizar empleado" });
    }
});


// Ruta para eliminar empleados
app.delete("/empleados/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM empleados WHERE id = ?";
    try {
        await pool.query(query, [id]);
        res.status(200).send("Empleado eliminado correctamente");
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).send("Ha habido un error");
    }
});

// Ruta para registrar empleados
app.post("/register", async (req, res) => {
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
        "INSERT INTO empleados (nombre, email, puesto, fechaNacimiento, curp, rfc, nss, genero, tipoContrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {
        await pool.execute(query, [
            nombre,
            email,
            puesto,
            formattedFechaNacimiento,
            curp,
            rfc,
            nss,
            genero,
            tipoContrato,
        ]);
        res.status(201).send("Empleado registrado correctamente");
    } catch (error) {
        console.error("Error al registrar empleado:", error);
        res.status(500).send("Error al registrar empleado");
    }
});

// Middleware para verificar sesión y rol
function auth(role) {
    return (req, res, next) => {
        console.log('Sesión actual:', req.session.user); // depuración

        if (!req.session.user) {
            return res.status(401).send('No autorizado: inicia sesión');
        }

        if (req.session.user.role !== role) {
            return res.status(403).send('Acceso denegado');
        }

        next();
    };
}

app.get('/admin-dashboard', auth('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_dashboard.html'));
});

app.get('/employee-dashboard', auth('empleado'), (req, res) => {
    res.sendFile(path.join(__dirname, 'employee_dashboard.html'));
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('No se pudo cerrar sesión');
        }

        res.clearCookie('connect.sid'); // elimina cookie
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
});
