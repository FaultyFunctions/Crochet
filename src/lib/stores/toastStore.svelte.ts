export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

let toastList = $state<Toast[]>([]);

export const toasts = {
    get value() { return toastList; }
};

export const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now();
    toastList = [{ id, message, type }, ...toastList];

    setTimeout(() => {
        toastList = toastList.filter((t) => t.id !== id);
    }, duration);
};