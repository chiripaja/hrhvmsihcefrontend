import Swal from "sweetalert2";



export const showSuccessAlert=(message = "Se agregó correctamente")=>{
    Swal.fire({
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

export const showSuccessError=(message = "Error comunicarse con el administrador")=>{
    Swal.fire({
        icon: "error",
        title: message
    });
}

export const showConfirmDeleteAlert = (message = "¿Estás seguro de eliminar?") => {
    return Swal.fire({
        title: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
};

export const showDeleteAlert = (message = "Se eliminó correctamente") => {
    Swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
};