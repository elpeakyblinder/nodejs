async function cargarEmpleados() {
    try {
        const API_URL = "http://localhost:3000";
        const respuesta = await fetch(`${API_URL}/empleados`);
        const empleados = await respuesta.json();
        const tabla = document.getElementById("tablaEmpleados");
        tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

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
                        <button class="btn btn-primary btn-sm" 
                            onclick="openEditModal('${emp.id}', '${emp.nombre}', '${emp.email}', '${emp.puesto}', '${emp.fechaNacimiento}', '${emp.genero}', '${emp.tipoContrato}')">
                            Actualizar
                        </button>
                    </td>
                </tr>`;
            tabla.insertAdjacentHTML("beforeend", fila);
        });
    } catch (error) {
        console.error("Error al cargar empleados:", error);
    }
}

// Función para eliminar empleados
const eliminarEmpleado = async (id) => {
    try {
        const respuesta = await fetch(`http://localhost:3000/empleados/${id}`, {
            method: "DELETE",
        });

        if (respuesta.ok) {
            alert("Empleado eliminado correctamente");
            cargarEmpleados(); // Refresca la tabla
        } else {
            alert("Ha habido un error al eliminar el empleado");
        }
    } catch (error) {
        console.error("Error: " + error);
    }
};

// Función para abrir el modal de edición con datos cargados
function openEditModal(
    id,
    nombre,
    email,
    puesto,
    fechaNacimiento,
    genero,
    tipoContrato
) {
    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPuesto").value = puesto;
    document.getElementById("editFechaNacimiento").value = fechaNacimiento;
    document.getElementById("editGenero").value = genero;
    document.getElementById("editTipoContrato").value = tipoContrato;

    const editEmployeeModal = new bootstrap.Modal(
        document.getElementById("editEmployeeModal")
    );
    editEmployeeModal.show();
}

// Función para enviar los datos actualizados
document.getElementById("editEmployeeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("editId").value;
    const updatedData = {
        nombre: document.getElementById("editNombre").value,
        email: document.getElementById("editEmail").value,
        puesto: document.getElementById("editPuesto").value,
        fechaNacimiento: document.getElementById("editFechaNacimiento").value,
        genero: document.getElementById("editGenero").value,
        tipoContrato: document.getElementById("editTipoContrato").value
    };

    try {
        const respuesta = await fetch(`http://localhost:3000/empleados/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (!respuesta.ok) throw new Error("Error al actualizar el empleado");

        alert("Empleado actualizado correctamente");
        cargarEmpleados();
        const modal = bootstrap.Modal.getInstance(document.getElementById("editEmployeeModal"));
        modal.hide();
    } catch (error) {
        console.error(error);
        alert("Hubo un error al actualizar el empleado");
    }
});

cargarEmpleados();
