import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Select from 'react-select';
import { ImageOff, Wine, X } from 'lucide-react';
import type { CurrencyCode } from '../constants/countryCurrency';
import {
  currencySymbol,
  formatDollarInput,
  formatIntegerPriceInput,
  normalizeRetailDollar,
  parseDollarInput,
  parseIntegerPriceInput,
  usesEmiPricing,
  usesRetailDecimals,
} from '../constants/countryCurrency';
import type { Nullable, Product } from '../types';
import { resolveRestaurantDietType } from '../utils/restaurantDiet';
import { adminSelectStyles } from '../utils/adminSelectStyles';
import {
  colorSlotValues,
  copyColorSlots,
  emptyColorSlots,
  normalizeProductColors,
  PRODUCT_COLOR_SLOT_INDEXES,
  type ProductColorSlots,
} from '../utils/productColors';
import {
  copyImageFiles,
  copyImageSlots,
  emptyImageFiles,
  emptyImageSlots,
  imageSlotValues,
  PRODUCT_IMAGE_SLOT_INDEXES,
  type ProductImageFileSlots,
  type ProductImageSlots,
} from '../utils/productImages';

export type ProductModalMode = 'create' | 'edit';

export type ProductModalValues = {
  name: string;
  brand: string;
  price: number;
  emiPrice: number;
  image: string;
  imageFile: File | null;
  /** Watches stores: up to 5 photos. Empty slots are unused. */
  images: ProductImageSlots;
  imageFiles: ProductImageFileSlots;
  inStock: boolean;
  category: string;
  /** Liquor stores: include on /deals when `deals`. */
  weeklyDeal: 'catalog' | 'deals';
  /** Restaurant stores: veg or non-veg. */
  dietType: 'veg' | 'non-veg';
  /** Watches stores: up to 5 hex colors. Empty slots are unused. */
  colors: ProductColorSlots;
  /** Watches stores: copy shown on the product detail page. */
  description: string;
};

const defaultValues: ProductModalValues = {
  name: '',
  brand: '',
  price: 0,
  emiPrice: 0,
  image: '',
  imageFile: null,
  images: emptyImageSlots(),
  imageFiles: emptyImageFiles(),
  inStock: true,
  category: '',
  weeklyDeal: 'catalog',
  dietType: 'non-veg',
  colors: emptyColorSlots(),
  description: '',
};

type ProductModalProps = {
  open: boolean;
  title: string;
  categoryChoices: ReadonlyArray<{ value: string; label: string }>;
  mode: ProductModalMode;
  /** Derived from client country (IN → INR + EMI, US → USD retail). */
  currencyCode?: CurrencyCode;
  initial?: Nullable<Product>;
  allowImageUpload?: boolean;
  /** Liquor template: show Deals page listing dropdown. */
  showWeeklyDealField?: boolean;
  /** Override EMI field visibility (defaults from currency). */
  showEmiField?: boolean;
  brandLabel?: string;
  /** Restaurant template: show veg / non-veg selector. */
  showDietField?: boolean;
  /** Watches template: show up to 5 color pickers. */
  showColorsField?: boolean;
  /** Watches template: show product description textarea. */
  showDescriptionField?: boolean;
  /** Watches template: show up to 5 product image slots. */
  showGalleryField?: boolean;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: ProductModalValues) => void | Promise<void>;
};

type CategoryOption = { value: string; label: string };
type StockOption = { value: 'in' | 'out'; label: string };
type WeeklyDealOption = { value: 'catalog' | 'deals'; label: string };
type DietOption = { value: 'veg' | 'non-veg'; label: string };

const RESTAURANT_DIET_MODAL_OPTIONS: DietOption[] = [
  { value: 'veg', label: 'Veg' },
  { value: 'non-veg', label: 'Non-veg' },
];

const WEEKLY_DEAL_MODAL_OPTIONS: WeeklyDealOption[] = [
  { value: 'catalog', label: 'Catalog only (Shop, Spirits, Wine, Beer)' },
  { value: 'deals', label: 'Weekly specials — Deals page' },
];

const STOCK_MODAL_OPTIONS: StockOption[] = [
  { value: 'in', label: 'In stock' },
  { value: 'out', label: 'Out of stock' },
];

export function ProductModal({
  open,
  title,
  categoryChoices,
  mode,
  currencyCode = 'INR',
  initial,
  allowImageUpload = false,
  showWeeklyDealField = false,
  showEmiField,
  brandLabel = 'Brand',
  showDietField = false,
  showColorsField = false,
  showDescriptionField = false,
  showGalleryField = false,
  saving = false,
  onClose,
  onSave,
}: ProductModalProps): JSX.Element {
  const showEmi = showEmiField ?? usesEmiPricing(currencyCode);
  const retailPrice = usesRetailDecimals(currencyCode);
  const priceLabel = `Price (${currencySymbol(currencyCode)})`;
  const { register, control, handleSubmit, reset, watch, setValue, setError, formState } =
    useForm<ProductModalValues>({
    defaultValues,
    mode: 'onSubmit',
  });

  const image = watch('image');
  const imageFile = watch('imageFile');
  const imageFiles = watch('imageFiles');
  const [imageBroken, setImageBroken] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>(emptyImageSlots());
  const [priceText, setPriceText] = useState('');
  const [emiPriceText, setEmiPriceText] = useState('');

  useEffect(() => {
    setImageBroken(false);
  }, [image]);

  const categoryOptions = useMemo((): CategoryOption[] => {
    return categoryChoices.map((c) => ({ value: c.value, label: c.label }));
  }, [categoryChoices]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (mode === 'edit' && initial) {
      const price = retailPrice ? normalizeRetailDollar(initial.price) : initial.price;
      reset({
        name: initial.name,
        brand: initial.brand,
        price,
        emiPrice: showEmi ? initial.emiPrice : 0,
        image: initial.image ?? '',
        imageFile: null,
        inStock: initial.inStock,
        category: initial.subcategory ?? initial.category,
        weeklyDeal: initial.featuredGroup === 'deal' ? 'deals' : 'catalog',
        dietType: resolveRestaurantDietType(
          initial.name,
          initial.subcategory ?? initial.category,
          initial.dietType,
        ),
        colors: colorSlotValues(initial.colors),
        description: initial.description ?? '',
        images: imageSlotValues(initial.images ?? (initial.image ? [initial.image] : [])),
        imageFiles: emptyImageFiles(),
      });
      setPriceText(
        retailPrice ? formatDollarInput(price) : formatIntegerPriceInput(price),
      );
      setEmiPriceText(showEmi ? formatIntegerPriceInput(initial.emiPrice) : '');
    } else {
      reset({
        ...defaultValues,
        emiPrice: showEmi ? defaultValues.emiPrice : 0,
        category: categoryChoices[0]?.value ?? '',
        weeklyDeal: 'catalog',
        dietType: 'non-veg',
        colors: emptyColorSlots(),
        description: '',
        images: emptyImageSlots(),
        imageFiles: emptyImageFiles(),
      });
      setPriceText('');
      setEmiPriceText('');
    }
  }, [open, mode, initial, categoryChoices, reset, showEmi, retailPrice]);

  useEffect(() => {
    if (!imageFile) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    const files = imageFiles ?? emptyImageFiles();
    const urls = files.map((file) => (file ? URL.createObjectURL(file) : null));
    setGalleryPreviews(urls);
    return () => {
      urls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageFiles]);

  const previewSrc = filePreview ?? image;

  const onSubmit = async (values: ProductModalValues): Promise<void> => {
    if (!priceText.trim()) {
      setError('price', { type: 'required', message: 'Price is required' });
      return;
    }
    const price = retailPrice ? parseDollarInput(priceText) : parseIntegerPriceInput(priceText);
    if (retailPrice ? price < 0 : price <= 0) {
      setError('price', {
        type: 'min',
        message: retailPrice ? 'Price must be 0 or greater' : 'Price must be greater than 0',
      });
      return;
    }
    let emiPrice = 0;
    if (showEmi && emiPriceText.trim()) {
      emiPrice = parseIntegerPriceInput(emiPriceText);
      if (emiPrice < 0) {
        setError('emiPrice', { type: 'min', message: 'EMI must be 0 or greater' });
        return;
      }
    }
    const payload = {
      ...values,
      price,
      emiPrice,
      colors: colorSlotValues(normalizeProductColors(values.colors)),
      description: values.description.trim(),
      images: copyImageSlots(values.images),
      imageFiles: copyImageFiles(values.imageFiles),
      image: copyImageSlots(values.images)[0] || values.image,
      imageFile: values.imageFiles[0] ?? values.imageFile,
    };
    await onSave(payload);
  };

  const commitPriceText = (): void => {
    const parsed = retailPrice ? parseDollarInput(priceText) : parseIntegerPriceInput(priceText);
    setValue('price', parsed, { shouldValidate: true });
  };

  const commitEmiPriceText = (): void => {
    setValue('emiPrice', parseIntegerPriceInput(emiPriceText), { shouldValidate: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setValue('imageFile', file, { shouldValidate: true });
  };

  const handleGalleryFileChange = (
    index: (typeof PRODUCT_IMAGE_SLOT_INDEXES)[number],
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0] ?? null;
    const nextFiles = copyImageFiles(watch('imageFiles'));
    nextFiles[index] = file;
    setValue('imageFiles', nextFiles, { shouldValidate: true });
    if (file && index === 0) {
      setValue('imageFile', file, { shouldValidate: true });
    }
  };

  const clearGallerySlot = (index: (typeof PRODUCT_IMAGE_SLOT_INDEXES)[number]): void => {
    const nextUrls = copyImageSlots(watch('images'));
    const nextFiles = copyImageFiles(watch('imageFiles'));
    nextUrls[index] = '';
    nextFiles[index] = null;
    setValue('images', nextUrls, { shouldValidate: true });
    setValue('imageFiles', nextFiles, { shouldValidate: true });
    if (index === 0) {
      setValue('image', '', { shouldValidate: true });
      setValue('imageFile', null, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60 transition-opacity duration-200 data-[closed]:opacity-0" />
      <div className="admin-ui-root admin-scroll-rail fixed inset-0 z-50 overflow-y-auto p-4 md:p-8">
        <div className="flex min-h-full items-center justify-center py-8">
          <DialogPanel
            transition
            className="relative mx-auto w-full max-w-lg rounded-xl border border-white/10 bg-brand-card p-6 text-white shadow-2xl shadow-black/60 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
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
                  <span className="admin-label">{brandLabel}</span>
                  <input required className="admin-input" {...register('brand', { required: true })} />
                </label>
              </div>
              <div className={`grid grid-cols-1 gap-4 ${showEmi ? 'md:grid-cols-2' : ''}`}>
                <label className="block text-sm">
                  <span className="admin-label">{priceLabel}</span>
                  <input
                    required
                    type="text"
                    inputMode={retailPrice ? 'decimal' : 'numeric'}
                    autoComplete="off"
                    placeholder={retailPrice ? '29.99' : '599'}
                    className="admin-input"
                    value={priceText}
                    onChange={(e) => setPriceText(e.target.value)}
                    onBlur={commitPriceText}
                  />
                  {formState.errors.price ? (
                    <p className="mt-1 text-xs text-red-300">{formState.errors.price.message}</p>
                  ) : null}
                </label>
                {showEmi ? (
                  <label className="block text-sm">
                    <span className="admin-label">
                      EMI price / mo ({currencySymbol(currencyCode)}){' '}
                      <span className="font-normal text-gray-400">(optional)</span>
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Leave blank if no EMI"
                      className="admin-input"
                      value={emiPriceText}
                      onChange={(e) => setEmiPriceText(e.target.value)}
                      onBlur={commitEmiPriceText}
                    />
                    {formState.errors.emiPrice ? (
                      <p className="mt-1 text-xs text-red-300">{formState.errors.emiPrice.message}</p>
                    ) : null}
                  </label>
                ) : null}
              </div>
              {showGalleryField ? (
                <fieldset className="block text-sm">
                  <legend className="admin-label">Product images</legend>
                  <p className="mb-3 text-xs text-gray-400">
                    Up to five photos. The first is the catalog thumbnail.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {PRODUCT_IMAGE_SLOT_INDEXES.map((index) => {
                      const urls = watch('images') ?? emptyImageSlots();
                      const slotUrl = urls[index] ?? '';
                      const preview = galleryPreviews[index] || slotUrl;
                      return (
                        <label key={index} className="block text-sm">
                          <span className="admin-label">
                            Image {index + 1}
                            {index === 0 ? ' (main)' : ''}
                          </span>
                          {allowImageUpload ? (
                            <input
                              type="file"
                              accept="image/*"
                              className="admin-input mt-1"
                              onChange={(e) => handleGalleryFileChange(index, e)}
                            />
                          ) : null}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                              {preview ? (
                                <img src={preview} alt="" className="h-full w-full object-contain" />
                              ) : (
                                <ImageOff className="h-6 w-6 text-white/30" aria-hidden />
                              )}
                            </div>
                            {preview ? (
                              <button
                                type="button"
                                className="btn-admin-secondary !min-h-[44px] px-3 text-xs"
                                onClick={() => clearGallerySlot(index)}
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : (
              <label className="block text-sm">
                <span className="admin-label">Product image (optional)</span>
                {allowImageUpload ? (
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-input mt-1"
                    onChange={handleFileChange}
                  />
                ) : null}
                <input type="hidden" {...register('image')} />
                <div className="mt-2 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                  {previewSrc && !imageBroken ? (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="h-full object-contain"
                      onError={() => setImageBroken(true)}
                    />
                  ) : showWeeklyDealField ? (
                    <Wine className="h-16 w-16 shrink-0 text-brand-saffron/50" aria-hidden />
                  ) : previewSrc && imageBroken ? (
                    <div className="flex flex-col items-center gap-2 text-white/40">
                      <ImageOff className="h-8 w-8 shrink-0" aria-hidden />
                      <span className="text-sm">Image not found</span>
                    </div>
                  ) : null}
                </div>
              </label>
              )}
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
              {showWeeklyDealField ? (
                <label className="block text-sm">
                  <span className="admin-label">Deals page</span>
                  <p className="mb-2 text-xs text-gray-400">
                    Category above still controls Spirits, Wine, and Beer. Choose Deals page to also show this
                    item under Weekly specials.
                  </p>
                  <div className="mt-1">
                    <Controller
                      name="weeklyDeal"
                      control={control}
                      render={({ field }) => (
                        <Select<WeeklyDealOption, false>
                          instanceId="product-modal-weekly-deal"
                          inputId="product-modal-weekly-deal"
                          options={WEEKLY_DEAL_MODAL_OPTIONS}
                          value={WEEKLY_DEAL_MODAL_OPTIONS.find((o) => o.value === field.value) ?? null}
                          onChange={(opt) => {
                            field.onChange(opt?.value ?? 'catalog');
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
              ) : null}
              {showDietField ? (
                <label className="block text-sm">
                  <span className="admin-label">Diet</span>
                  <div className="mt-1">
                    <Controller
                      name="dietType"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select<DietOption, false>
                          instanceId="product-modal-diet"
                          inputId="product-modal-diet"
                          options={RESTAURANT_DIET_MODAL_OPTIONS}
                          value={
                            RESTAURANT_DIET_MODAL_OPTIONS.find((o) => o.value === field.value) ?? null
                          }
                          onChange={(opt) => {
                            field.onChange(opt?.value ?? 'non-veg');
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
              ) : null}
              {showColorsField ? (
                <fieldset className="block text-sm">
                  <legend className="admin-label">Colors</legend>
                  <p className="mb-3 text-xs text-gray-400">Tap a pill to set a color. Five slots max.</p>
                  <div className="flex flex-wrap gap-3">
                    {PRODUCT_COLOR_SLOT_INDEXES.map((index) => {
                      const current = watch('colors') ?? emptyColorSlots();
                      const slotValue = current[index] ?? '';
                      const setSlot = (value: string): void => {
                        const next = copyColorSlots(current);
                        next[index] = value;
                        setValue('colors', next, { shouldValidate: true });
                      };
                      return (
                        <label
                          key={index}
                          className={`relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 ${
                            slotValue ? 'border-white/40' : 'border-dashed border-white/25 bg-white/5'
                          }`}
                          style={slotValue ? { backgroundColor: slotValue } : undefined}
                        >
                          <input
                            type="color"
                            aria-label={`Product color ${index + 1}`}
                            className="absolute inset-0 cursor-pointer opacity-0"
                            value={slotValue || '#111111'}
                            onChange={(e) => setSlot(e.target.value)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}
              {showDescriptionField ? (
                <label className="block text-sm">
                  <span className="admin-label">Description</span>
                  <textarea
                    rows={3}
                    className="admin-input min-h-[5rem]"
                    {...register('description')}
                  />
                </label>
              ) : null}
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
                <button type="submit" disabled={saving} className="btn-admin-primary w-full sm:w-auto">
                  {saving ? 'Saving…' : mode === 'create' ? 'Add' : 'Save changes'}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
