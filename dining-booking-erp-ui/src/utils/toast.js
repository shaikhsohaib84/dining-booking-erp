import { toast } from 'react-toastify';
import { ERROR_MESSAGE } from './constant';

export const toastError = (message=ERROR_MESSAGE, theme="dark") => {
    return toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            theme: theme,
    });
}