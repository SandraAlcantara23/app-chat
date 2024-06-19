const express = require('express');
const mysql = require('mysql');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'bbrlxgk5q9jhqpmuehki-mysql.services.clever-cloud.com',
    user: 'uyqjfe4k7v535vzx',
    password: 'Ybel8ZtHrJoz0kezEGuh',
    port: 3306,
    database: 'bbrlxgk5q9jhqpmuehki'
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Manejar la conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('sendMessage', (data) => {
        const { username, message } = data;
        if (!username || !message) {
            console.error('Username o mensaje vacío');
            return;
        }
        const query = 'INSERT INTO messages (username, message) VALUES (?, ?)';
        db.query(query, [username, message], (err, result) => {
            if (err) {
                console.error('Error al insertar el mensaje en la base de datos:', err.message);
                return;
            }
            console.log('Mensaje insertado en la base de datos');
            io.emit('newMessage', { username, message });
        });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
