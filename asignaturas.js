// Variable global que contendrá los datos del JSON
let datos = {};

// Función encargada de cargar los datos externos al iniciar la página
async function cargarDatosInstitucion() {
    try {
        const respuesta = await fetch('datos.json');
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el archivo datos.json');
        }
        datos = await respuesta.json();
        
        // Una vez cargados los datos, rellenamos el selector de carreras
        cargarCarreras();
    } catch (error) {
        console.error("Error al inicializar los datos:", error);
    }
}