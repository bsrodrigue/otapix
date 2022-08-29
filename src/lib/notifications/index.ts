import { toast, TypeOptions } from 'react-toastify';

export function notify(message: string, type: TypeOptions) {
  toast(message, { type });
}

export function notifyError(message: string) {
  notify(message, 'error');
}

export function notifySuccess(message: string) {
  notify(message, 'success');
}
