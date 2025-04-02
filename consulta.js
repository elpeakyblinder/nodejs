async function cargarEmpleados() {
    try {
        const API_URL = "http://localhost:3000";
        const respuesta = await fetch(`${API_URL}/empleados`);
        const empleados = await respuesta.json();
        const tabla = document.getElementById("tablaEmpleados");
        empleados.forEach((emp) => {
            const fila = `
                <tr class="text-center">
                    <td>${emp.nombre}</td>
                    <td>${emp.email}</td>
                    <td>${emp.puesto}</td>
                    <td>${emp.fechaNacimiento}</td>
                    <td>${emp.genero}</td>
                    <td>${emp.tipoContrato}</td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${emp.id}')">Eliminar</button>
                        <button class="btn btn-primary btn-sm" onclick="actualizarEmpleado('${emp.id}')">Actualizar</button>
                    </td>
                </tr>`;
            tabla.insertAdjacentHTML("beforeend", fila);
        });
    } catch (error) {
        console.error("Error al cargar empleados:", error);
    }
}

// Función para eliminar empleados, lo ideal sería poner un modal para preguntar primero si se desea eliminar o no
const eliminarEmpleado = async (id) => {
    try {
        const respuesta = await fetch(`http://localhost:3000/empleados/${id}`, {
            method: "DELETE",
        });

        if (respuesta.ok) {
            alert("Empleado eliminado correctamente");
            document.getElementById("tablaEmpleados").innerHTML = ""; // Limpia la tabla
            cargarEmpleados(); // Refresca la tabla
        } else {
            alert("Ha habido un error al eliminar el empleado");
        }
    } catch (error) {
        console.error("Error: " + error);
    }
};

// Función para actualizar empleados

cargarEmpleados();
