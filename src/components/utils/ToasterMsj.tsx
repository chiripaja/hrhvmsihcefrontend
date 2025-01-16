import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const ToasterMsj = (message: string, type: ToastType = 'success',descripcion:string) => {
    switch (type) {
        case 'success':
            toast.success(message, {
                description: descripcion,
                duration: 3000,
            });
            break;
        case 'error':
            toast.error(message, {
                description: descripcion,
                duration: 5000,
            });
            break;
        case 'warning':
            toast.warning(message, {
                description: descripcion,
                duration: 4000,
            });
            break;
        case 'info':
            toast(message, {
                description: descripcion,
                duration: 3000,
            });
            break;
        default:
            toast(message);
            break;
    }
};
