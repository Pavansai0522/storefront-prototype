import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Select from 'react-select';
import { ImageOff, X } from 'lucide-react';
import type { Nullable, Product } from '../types';
import { adminSelectStyles } from '../utils/adminSelectStyles';

export type ProductModalMode = 'create' | 'edit';

export type ProductModalValues = {
  name: string;
  brand: string;
  price: number;
  emiPrice: number;
  image: string;
  inStock: boolean;
  category: string;
};

const defaultValues: ProductModalValues = {
  name: '',
  brand: '',
  price: 0,
  emiPrice: 0,
  image: '',
  inStock: true,
  category: '',
};

type ProductModalProps = {
  open: boolean;
  title: string;
  categories: string[];
  mode: ProductModalMode;
  initial?: Nullable<Product>;
  onClose: () => void;
  onSave: (values: ProductModalValues) => void;
};

type CategoryOption = { value: string; label: string };
type StockOption = { value: 'in' | 'out'; label: string };

const STOCK_MODAL_OPTIONS: StockOption[] = [
  { value: 'in', label: 'In stock' },
  { value: 'out', label: 'Out of stock' },
];

export function ProductModal({
  open,
  title,
  categories,
  mode,
  initial,
  onClose,
  onSave,
}: ProductModalProps): JSX.Element {
  const { register, control, handleSubmit, reset, watch, formState } = useForm<ProductModalValues>({
    defaultValues,
    mode: 'onSubmit',
  });

  const image = watch('image');
  const [imageBroken, setImageBroken] = React.useState(false);

  useEffect(() => {
    setImageBroken(false);
  }, [image]);

  const categoryOptions = useMemo((): CategoryOption[] => {
    return categories.map((c) => ({ value: c, label: c }));
  }, [categories]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === 'edit' && initial) {
      reset({
        name: initial.name,
        brand: initial.brand,
        price: initial.price,
        emiPrice: initial.emiPrice,
        image: initial.image ?? '',
        inStock: initial.inStock,
        category: initial.category,
      });
    } else {
      reset({
        ...defaultValues,
        category: categories[0] ?? '',
      });
    }
  }, [open, mode, initial, categories, reset]);

  const onSubmit = (values: ProductModalValues): void => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60 transition-opacity duration-200 data-[closed]:opacity-0" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className="relative mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-brand-card p-6 shadow-2xl shadow-black/60 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <DialogTitle
                id="product-modal-title"
                className="min-w-0 break-words font-display text-xl uppercase tracking-wide text-white md:text-2xl"
              >
                {title}
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="admin-label">Name</span>
                  <input required className="admin-input" {...register('name', { required: true })} />
                </label>
                <label className="block text-sm">
                  <span className="admin-label">Brand</span>
                  <input required className="admin-input" {...register('brand', { required: true })} />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="admin-label">Price (₹)</span>
                  <input
                    required
                    type="number"
                    min={0}
                    step={1}
                    className="admin-input"
                    {...register('price', {
                      required: true,
                      valueAsNumber: true,
                      min: { value: 0, message: 'Price must be 0 or greater' },
                    })}
                  />
                  {formState.errors.price ? (
                    <p className="mt-1 text-xs text-red-300">{formState.errors.price.message}</p>
                  ) : null}
                </label>
                <label className="block text-sm">
                  <span className="admin-label">EMI price / mo (₹)</span>
                  <input
                    required
                    type="number"
                    min={0}
                    step={1}
                    className="admin-input"
                    {...register('emiPrice', {
                      required: true,
                      valueAsNumber: true,
                      min: { value: 0, message: 'EMI must be 0 or greater' },
                    })}
                  />
                  {formState.errors.emiPrice ? (
                    <p className="mt-1 text-xs text-red-300">{formState.errors.emiPrice.message}</p>
                  ) : null}
                </label>
              </div>
              <label className="block text-sm">
                <span className="admin-label">Image URL</span>
                <input required type="url" className="admin-input" {...register('image', { required: true })} />
                {image ? (
                  <div className="mt-2 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                    {!imageBroken ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="h-full object-contain"
                        onError={() => setImageBroken(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/40">
                        <ImageOff className="h-8 w-8 shrink-0" aria-hidden />
                        <span className="text-sm">Image not found</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </label>
              <label className="block text-sm">
                <span className="admin-label">Category</span>
                <div className="mt-1">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select<CategoryOption, false>
                        instanceId="product-modal-category"
                        inputId="product-modal-category"
                        options={categoryOptions}
                        value={categoryOptions.find((o) => o.value === field.value) ?? null}
                        onChange={(opt) => {
                          field.onChange(opt?.value ?? '');
                        }}
                        onBlur={field.onBlur}
                        styles={adminSelectStyles}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    )}
                  />
                </div>
              </label>
              <label className="block text-sm">
                <span className="admin-label">Stock</span>
                <div className="mt-1">
                  <Controller
                    name="inStock"
                    control={control}
                    render={({ field }) => (
                      <Select<StockOption, false>
                        instanceId="product-modal-stock"
                        inputId="product-modal-stock"
                        options={STOCK_MODAL_OPTIONS}
                        value={
                          field.value
                            ? STOCK_MODAL_OPTIONS.find((o) => o.value === 'in') ?? null
                            : STOCK_MODAL_OPTIONS.find((o) => o.value === 'out') ?? null
                        }
                        onChange={(opt) => {
                          field.onChange(opt?.value === 'in');
                        }}
                        onBlur={field.onBlur}
                        styles={adminSelectStyles}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    )}
                  />
                </div>
              </label>
              <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="btn-admin-secondary w-full sm:w-auto">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary w-full sm:w-auto">
                  {mode === 'create' ? 'Add' : 'Save changes'}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
