import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps): JSX.Element {
  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_18px_rgba(220,38,38,0.35)]'
      : 'bg-brand-saffron hover:bg-brand-saffronHover shadow-[0_0_18px_rgba(255,107,0,0.25)]';

  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60 transition-opacity duration-200 data-[closed]:opacity-0" />
      <div className="admin-ui-root admin-scroll-rail fixed inset-0 z-50 overflow-y-auto p-4 md:p-8">
        <div className="flex min-h-full items-center justify-center py-8">
          <DialogPanel
            transition
            className="relative mx-auto w-full max-w-lg rounded-xl border border-white/10 bg-brand-card p-6 text-white shadow-2xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <DialogTitle
                id="confirm-modal-title"
                className="min-w-0 break-words pr-2 font-display text-xl uppercase tracking-wide text-white md:text-2xl"
              >
                {title}
              </DialogTitle>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="break-words py-4 text-sm leading-relaxed text-gray-300">{message}</p>
            <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} className="btn-admin-secondary w-full sm:w-auto">
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-bold text-white transition sm:w-auto ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
