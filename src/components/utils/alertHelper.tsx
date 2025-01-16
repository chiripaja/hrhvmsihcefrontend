import Swal from "sweetalert2";



export const showSuccessAlert=(message = "Se agregó correctamente")=>{
    Swal.fire({
        icon: "success",
        title: "Se agrego correctamente",
        showConfirmButton: false,
        timer: 1500
    });
}