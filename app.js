const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let usuarios = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];


app.get('/', (req, res) => {
    res.send(`
    <h1>¡Bienvenido a la lista de usuarios!</h1>
    <ul>
    ${usuarios.map(usuario => `<li>
    ID: ${usuario.id} | Nombre: ${usuario.nombre}  | Edad: ${usuario.edad} | Lugar de Procedencia: ${usuario.lugarProcedencia}
    <button type="button" onclick="eliminarUsuario('${usuario.nombre}')">Eliminar</button>
    </li>`
    )
    .join('')}
    </ul>

    <script>
    function eliminarUsuario(nombre) {
        if (confirm('¿Seguro que quieres eliminar a ' + nombre + '?')) {
            fetch('/usuarios/' + nombre, { method: 'DELETE' })
                .then(function(response) {
                    if (response.ok) {
                        alert('Usuario eliminado exitosamente');
                        location.reload();
                    } else {
                        alert('Error al eliminar el usuario');
                    }
                });
        }
    }
</script>

    <form action="/usuarios" method="post">
    <label for"nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" required>

    <label for"edad">Edad</label>
    <input type="text" id="edad" name="edad" required>

    <label for"lugarProcedencia">Lugar de Procedencia</label>
    <input type="text" id="lugarProcedencia" name="lugarProcedencia" required>

    <button type="submit">Agregar Usuario</button>
    </form>

    <form action="/buscar" method="get">
    <label for="buscarNombre">Buscar por nombre</label>
    <input type="text" id="buscarNombre" name="buscarNombre" required>
    <button type="submit">Buscar</button>
</form>
    `);

});

app.post('/usuarios', (req, res)=> {
    const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    edad: req.body.edad, 
    lugarProcedencia: req.body.lugarProcedencia
    };

    usuarios.push(nuevoUsuario);
    res.redirect('/');
})

app.get('/usuarios/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    const usuario = usuarios.find(u => u.nombre === nombreUsuario);

    if (usuario) {
        res.json(usuario);
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

app.get('/buscar', (req, res) => {
    const nombreUsuario = req.query.buscarNombre;
    const usuario = usuarios.find(u => u.nombre === nombreUsuario);

    if (usuario) {
        res.send(`
            <h2>Resultado de la búsqueda</h2>
            <ul>
                <li>ID: ${usuario.id} | Nombre: ${usuario.nombre} | Edad: ${usuario.edad} | Lugar de Procedencia: ${usuario.lugarProcedencia}</li>
            </ul>
            <a href="/">Volver a la lista de usuarios</a>
        `);
    } else {
        res.send('<p>Usuario no encontrado</p><a href="/">Volver a la lista de usuarios</a>');
    }
});


app.put('/usuarios/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    const index = usuarios.findIndex(u => u.nombre === nombreUsuario);

    if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...req.body };
        res.json({ message: 'Usuario actualizado exitosamente', usuario: usuarios[index] });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

app.delete('/usuarios/:nombre', (req, res) => {
    const nombreUsuario = req.params.nombre;
    usuarios = usuarios.filter(u => u.nombre !== nombreUsuario);
    res.json({ message: 'Usuario eliminado exitosamente' });
});

app.listen(3000, () => {
    console.log(`Servidor escuchando en el puerto 3000`);
});