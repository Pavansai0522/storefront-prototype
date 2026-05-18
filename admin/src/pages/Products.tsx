import React, { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from '@tanstack/react-table';
import Select from 'react-select';
import { CheckSquare, Pencil, Plus, Search, Smartphone, Trash2 } from 'lucide-react';
import { LIQUOR_CATEGORIES, PRODUCT_CATEGORIES, SKELETON_DELAY_MS, WATCHES_SUBCATEGORIES } from '../constants';
import { isLiquorStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import { useAdminData } from '../context/AdminDataContext';
import {
  SORT_KEY_OPTIONS,
  STOCK_FILTER_OPTIONS,
  useProducts,
  type CategoryFilterOption,
  type SortKeyOption,
  type StockFilterOption,
} from '../hooks';
import type { Nullable, Product } from '../types';
import { getClientCurrency, formatClientMoney } from '../utils/clientCurrency';
import { usesEmiPricing, usesRetailDecimals } from '../constants/countryCurrency';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProductModal, type ProductModalMode } from '../components/ProductModal';
import { SkeletonTable } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';
import { RequireStoreBanner } from '../components/RequireStoreBanner';
import { useProfile } from '../hooks/useProfile';
import { uploadProductImage } from '../services/catalogService';
import { adminSelectStyles } from '../utils/adminSelectStyles';
import { findClientById } from '../utils/clientLookup';
import { showToast } from '../utils/showToast';

const columnHelper = createColumnHelper<Product>();

export function Products(): JSX.Element {
  const { effectiveClientId, isSuperadmin } = useProfile();
  const clientId = effectiveClientId;
  const { products, setProducts, clients, saveProduct, removeProduct, removeProducts, dataLoading } =
    useAdminData();

  const client = useMemo(
    () => findClientById(clients, clientId) ?? null,
    [clients, clientId],
  );
  const isLiquor = isLiquorStoreTemplate(client?.template);
  const isWatches = isWatchesStoreTemplate(client?.template);
  const currencyCode = client ? getClientCurrency(client) : 'INR';
  const showEmi = usesEmiPricing(currencyCode);
  const useRetailPrice = usesRetailDecimals(currencyCode);
  const productCategoryChoices = useMemo(() => {
    if (isLiquor) return LIQUOR_CATEGORIES;
    if (isWatches) return WATCHES_SUBCATEGORIES;
    return PRODUCT_CATEGORIES;
  }, [isLiquor, isWatches]);

  const rows = useMemo(
    () => (clientId ? products.filter((p) => p.clientId === clientId) : products),
    [products, clientId],
  );

  const {
    filtered: displayRows,
    search,
    setSearch,
    category: categoryFilter,
    setCategory: setCategoryFilter,
    stock: stockFilter,
    setStock: setStockFilter,
    sort: sortKey,
    setSort: setSortKey,
    clearFilters,
    categoryFilterOptions,
  } = useProducts(rows, productCategoryChoices);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    setRowSelection({});
  }, [search, categoryFilter, stockFilter, sortKey]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProductModalMode>('create');
  const [editing, setEditing] = useState<Nullable<Product>>(null);
  const [deleteTarget, setDeleteTarget] = useState<Nullable<Product>>(null);

  useEffect(() => {
    if (dataLoading) {
      return;
    }
    const t = window.setTimeout(() => setLoading(false), SKELETON_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [dataLoading]);

  const openCreate = (): void => {
    setModalMode('create');
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: Product): void => {
    setModalMode('edit');
    setEditing(item);
    setModalOpen(true);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => {
          const visible = table.getRowModel().rows;
          const allSel = visible.length > 0 && visible.every((r) => r.getIsSelected());
          const someSel = visible.some((r) => r.getIsSelected());
          return (
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-brand-bg accent-brand-saffron"
              checked={allSel}
              ref={(el) => {
                if (el) {
                  el.indeterminate = someSel && !allSel;
                }
              }}
              onChange={() => {
                if (allSel) {
                  table.toggleAllRowsSelected(false);
                } else {
                  visible.forEach((r) => r.toggleSelected(true));
                }
              }}
              aria-label="Select all visible products"
            />
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-brand-bg accent-brand-saffron"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        size: 48,
      }),
      columnHelper.accessor('name', {
        header: 'Product',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={p.image ?? ''}
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
              />
              <div className="min-w-0">
                <p className="break-words font-medium text-white">{p.name}</p>
                <p className="hidden text-xs text-gray-400 md:block">{p.brand}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => {
          const v = info.getValue();
          const choices = isLiquor ? LIQUOR_CATEGORIES : PRODUCT_CATEGORIES;
          const label = choices.find((c) => c.value === v)?.label ?? v;
          return <span className="text-gray-200">{label}</span>;
        },
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className="text-gray-200">
            {client
              ? formatClientMoney(client, info.getValue(), { retail: useRetailPrice })
              : String(info.getValue())}
          </span>
        ),
      }),
      ...(showEmi
        ? []
        : [
            columnHelper.accessor('emiPrice', {
              header: 'EMI / mo',
              cell: (info) => (
                <span className="text-gray-200">
                  {client ? formatClientMoney(client, info.getValue()) : String(info.getValue())}
                </span>
              ),
            }),
          ]),
      columnHelper.accessor('inStock', {
        header: 'Stock',
        cell: (info) => {
          const inStock = info.getValue();
          return (
            <span
              className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ${
                inStock
                  ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/25'
                  : 'bg-gray-500/15 text-gray-300 ring-gray-500/25'
              }`}
            >
              {inStock ? 'In stock' : 'Out of stock'}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-brand-bg p-2 text-gray-400 transition hover:border-brand-saffron hover:text-brand-saffron"
                aria-label={`Edit ${p.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(p)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                aria-label={`Delete ${p.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    [isLiquor, client, showEmi, useRetailPrice],
  );

  const table = useReactTable({
    data: displayRows,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const handleSave = async (values: {
    name: string;
    brand: string;
    price: number;
    emiPrice: number;
    image: string;
    imageFile: File | null;
    inStock: boolean;
    category: string;
  }): Promise<void> => {
    if (!clientId) {
      showToast(
        isSuperadmin
          ? 'Open Clients and use Manage as store on PR Watches first.'
          : 'Unable to save product. No store is linked to this account.',
        'error',
      );
      return;
    }
    const ownerId = clientId ?? editing?.clientId;
    if (!ownerId) {
      showToast('No store selected for this product.', 'error');
      return;
    }
    setSaving(true);
    try {
      const productId =
        modalMode === 'edit' && editing ? editing.id : globalThis.crypto.randomUUID();
      let imageUrl = values.image.trim();

      if (values.imageFile) {
        imageUrl = await uploadProductImage(ownerId, productId, values.imageFile);
      }

      if (!imageUrl) {
        showToast('Add a product image (upload or URL).', 'error');
        return;
      }

      const subcategory = isWatches ? values.category : null;
      const category = (isWatches ? values.category : values.category) as Product['category'];

      const product: Product = {
        id: productId,
        clientId: ownerId,
        name: values.name,
        brand: values.brand,
        price: values.price,
        emiPrice: values.emiPrice,
        image: imageUrl,
        inStock: values.inStock,
        category,
        subcategory,
        isAccessory: false,
      };

      await saveProduct(product);
      showToast(modalMode === 'create' ? 'Product added successfully' : 'Product updated successfully', 'success');
      setModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const selectedIds = useMemo(() => {
    return new Set(
      Object.keys(rowSelection)
        .filter((id) => rowSelection[id])
        .map((id) => id),
    );
  }, [rowSelection]);

  const selectedCount = selectedIds.size;

  const markBulkStock = (inStock: boolean): void => {
    if (selectedCount === 0) {
      return;
    }
    setProducts((prev) => prev.map((p) => (selectedIds.has(p.id) ? { ...p, inStock } : p)));
    if (inStock) {
      showToast(`${selectedCount} products marked in stock`, 'success');
    } else {
      showToast(`${selectedCount} products marked out of stock`, 'success');
    }
    setRowSelection({});
  };

  const confirmBulkDelete = async (): Promise<void> => {
    if (selectedCount === 0) {
      return;
    }
    try {
      await removeProducts([...selectedIds]);
      showToast(`${selectedCount} product${selectedCount === 1 ? '' : 's'} deleted`, 'success');
      setRowSelection({});
      setBulkDeleteOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const showFilterEmpty = rows.length > 0 && displayRows.length === 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        <RequireStoreBanner />
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="admin-page-heading">Products</h1>
            <p className="admin-page-subtitle mt-2 break-words">
              {client
                ? `Managing catalog for ${client.storeName}.`
                : isSuperadmin
                  ? 'Select a store from Clients to manage its catalog.'
                  : 'Products'}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            disabled={isSuperadmin && !clientId}
            className="btn-admin-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add product
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : rows.length === 0 ? (
          <div className="admin-table-shell">
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <Smartphone className="size-16 text-white/20" aria-hidden />
              <h2 className="font-display text-2xl text-white/60">No products yet</h2>
              <p className="max-w-xs text-center text-sm text-white/40">
                {isLiquor
                  ? 'Add your first bottle or product to start building your catalog'
                  : isWatches
                    ? 'Add your first watch, toy, or accessory to start building your catalog'
                    : 'Add your first phone or device to start building your catalog'}
              </p>
              <button type="button" onClick={openCreate} className="btn-admin-primary w-full sm:w-auto">
                + Add First Product
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-4 items-end">
              <div className="relative min-w-[min(100%,280px)] flex-[2] basis-[240px]">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  aria-hidden
                />
                <input
                  type="search"
                  className="admin-input !mt-0 w-full py-2.5 pl-10"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products by name"
                />
              </div>
              <div className="flex min-w-[140px] flex-1 flex-col text-sm sm:flex-initial">
                <span className="sr-only">Category</span>
                <Select<CategoryFilterOption, false>
                  instanceId="products-category-filter"
                  inputId="products-category-filter"
                  options={categoryFilterOptions}
                  value={categoryFilterOptions.find((o) => o.value === categoryFilter) ?? null}
                  onChange={(opt) => {
                    if (opt) {
                      setCategoryFilter(opt.value);
                    }
                  }}
                  styles={adminSelectStyles}
                  isSearchable={false}
                />
              </div>
              <div className="flex min-w-[140px] flex-1 flex-col text-sm sm:flex-initial">
                <span className="sr-only">Stock</span>
                <Select<StockFilterOption, false>
                  instanceId="products-stock-filter"
                  inputId="products-stock-filter"
                  options={STOCK_FILTER_OPTIONS}
                  value={STOCK_FILTER_OPTIONS.find((o) => o.value === stockFilter) ?? null}
                  onChange={(opt) => {
                    if (opt) {
                      setStockFilter(opt.value);
                    }
                  }}
                  styles={adminSelectStyles}
                  isSearchable={false}
                />
              </div>
              <div className="flex min-w-[160px] flex-1 flex-col text-sm sm:flex-initial">
                <span className="sr-only">Sort by</span>
                <Select<SortKeyOption, false>
                  instanceId="products-sort-filter"
                  inputId="products-sort-filter"
                  options={SORT_KEY_OPTIONS}
                  value={SORT_KEY_OPTIONS.find((o) => o.value === sortKey) ?? null}
                  onChange={(opt) => {
                    if (opt) {
                      setSortKey(opt.value);
                    }
                  }}
                  styles={adminSelectStyles}
                  isSearchable={false}
                />
              </div>
            </div>
            <p className="text-sm text-white/40">
              Showing {displayRows.length} of {rows.length} products
            </p>

            {selectedCount > 0 ? (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                <CheckSquare className="h-4 w-4 shrink-0 text-brand-saffron" aria-hidden />
                <span className="font-medium">{selectedCount} selected</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => markBulkStock(false)}
                    className="btn-admin-secondary px-3 py-1.5 text-xs sm:text-sm"
                  >
                    Mark Out of Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => markBulkStock(true)}
                    className="btn-admin-secondary px-3 py-1.5 text-xs sm:text-sm"
                  >
                    Mark In Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkDeleteOpen(true)}
                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 sm:text-sm"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            ) : null}

            <div className="admin-table-shell">
              {showFilterEmpty ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <p className="text-center text-sm text-white/60">No products match your search</p>
                  <button type="button" onClick={clearFilters} className="btn-admin-secondary">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-white">
                    <thead className="admin-thead">
                      {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                          {hg.headers.map((h) => (
                            <th
                              key={h.id}
                              className={`admin-th ${h.column.id === 'select' ? 'w-12' : ''} ${h.column.id === 'actions' ? 'text-right' : ''} ${h.column.id === 'category' || h.column.id === 'price' || h.column.id === 'emiPrice' ? 'hidden md:table-cell' : ''}`}
                            >
                              {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className={`admin-tr ${row.getIsSelected() ? 'bg-white/5' : ''}`}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={`px-4 py-3 ${cell.column.id === 'select' ? 'align-middle' : ''} ${cell.column.id === 'category' || cell.column.id === 'price' || cell.column.id === 'emiPrice' ? 'hidden md:table-cell' : ''} ${cell.column.id === 'actions' ? 'text-right' : ''}`}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        <ProductModal
          open={modalOpen}
          title={modalMode === 'create' ? 'Add product' : 'Edit product'}
          categoryChoices={[...productCategoryChoices]}
          mode={modalMode}
          currencyCode={currencyCode}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          saving={saving}
          allowImageUpload
        />
        <ConfirmModal
          open={deleteTarget !== null}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget?.name ?? ''}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            if (deleteTarget) {
              void removeProduct(deleteTarget.id)
                .then(() => showToast('Product deleted', 'success'))
                .catch((err: unknown) =>
                  showToast(err instanceof Error ? err.message : 'Delete failed', 'error'),
                );
            }
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
        <ConfirmModal
          open={bulkDeleteOpen}
          title="Delete products"
          message={`Delete ${selectedCount} products? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
        />
      </div>
    </PageTransition>
  );
}


