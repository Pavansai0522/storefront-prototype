import toast from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType): void {
  if (type === 'success') {
    toast.success(message);
    return;
  }
  if (type === 'error') {
    toast.error(message);
    return;
  }
  toast(message);
}
