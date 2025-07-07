import swal from "sweetalert2";
const showAlert = (title, icon) => {
    swal.fire({
        title,
        icon,
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        width: "auto",
        customClass: { popup: 'swal2-toast' }
    });
};

export default showAlert;