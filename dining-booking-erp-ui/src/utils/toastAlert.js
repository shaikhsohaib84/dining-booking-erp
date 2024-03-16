import { toast } from 'react-toastify';

export const toastAlert = (message='', type='info') => {
    return toast(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
            type: type
    });
}