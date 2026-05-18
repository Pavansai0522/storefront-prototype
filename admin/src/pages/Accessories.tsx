import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from '@tanstack/react-table';
import Select from 'react-select';
import { CheckSquare, Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ACCESSORY_CATEGORIES, SKELETON_DELAY_MS } from '../constants';
import { isLiquorStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import { useAdminData } from '../context/AdminDataContext';
import {
  SORT_KEY_OPTIONS,
  STOCK_FILTER_OPTIONS,
  useAccessories,
  type CategoryFilterOption,
  type SortKeyOption,
  type StockFilterOption,
} from '../hooks';
import type { Nullable, Product } from '../types';
import { formatClientMoney } from '../utils/clientCurrency';
import { ConfirmModal } from '../components/ConfirmModal';
import { ProductModal, type ProductModalMode } from '../components/ProductModal';
import { SkeletonTable } from '../components/AdminSkeleton';
import { PageTransition } from '../components/PageTransition';
import { RequireStoreBanner } from '../components/RequireStoreBanner';
import { useProfile } from '../hooks/useProfile';
import { adminSelectStyles } from '../utils/adminSelectStyles';
import { findClientById } from '../utils/clientLookup';
import { showToast } from '../utils/showToast';

const columnHelper = createColumnHelper<Product>();

export function Accessories(): JSX.Element {
  const { effectiveClientId: clientId, isSuperadmin } = useProfile();
  const { accessories, setAccessories, clients, saveProduct, removeProduct, removeProducts } =
    useAdminData();

  const client = useMemo(
    () => findClientById(clients, clientId) ?? null,
    [clients, clientId],
  );

  if (client && (isLiquorStoreTemplate(client.template) || isWatchesStoreTemplate(client.template))) {
    return <Navigate to="/products" replace />;
  }

  const rows = useMemo(
    () => (clientId ? accessories.filter((p) => p.clientId === clientId) : accessories),
    [accessories, clientId],
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
  } = useAccessories(rows);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    setRowSelection({});
  }, [search, categoryFilter, stockFilter, sortKey]);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProductModalMode>('create');
  const [editing, setEditing] = useState<Nullable<Product>>(null);
  const [deleteTarget, setDeleteTarget] = useState<Nullable<Product>>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), SKELETON_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

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
              aria-label="Select all visible accessories"
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
        header: 'Accessory',
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
        cell: (info) => <span className="text-gray-200">{info.getValue()}</span>,
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className="text-gray-200">
            {client ? formatClientMoney(client, info.getValue()) : String(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('emiPrice', {
        header: 'EMI / mo',
        cell: (info) => (
          <span className="text-gray-200">
            {client ? formatClientMoney(client, info.getValue()) : String(info.getValue())}
          </span>
        ),
      }),
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
    [],
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
    inStock: boolean;
    category: string;
  }): Promise<void> => {
    if (!clientId && !isSuperadmin) {
      showToast('Unable to save accessory. No store is linked to this account.', 'error');
      return;
    }
    const ownerId = clientId ?? editing?.clientId ?? rows[0]?.clientId ?? 'client-1';
    const productId = modalMode === 'edit' && editing ? editing.id : globalThis.crypto.randomUUID();
    const product: Product = {
      id: productId,
      clientId: ownerId,
      name: values.name,
      brand: values.brand,
      price: values.price,
      emiPrice: values.emiPrice,
      image: values.image,
      inStock: values.inStock,
      category: values.category as Product['category'],
      isAccessory: true,
    };
    try {
      await saveProduct(product);
      showToast(
        modalMode === 'create' ? 'Accessory added successfully' : 'Accessory updated successfully',
        'success',
      );
      setModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
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
    setAccessories((prev) => prev.map((p) => (selectedIds.has(p.id) ? { ...p, inStock } : p)));
    if (inStock) {
      showToast(`${selectedCount} accessories marked in stock`, 'success');
    } else {
      showToast(`${selectedCount} accessories marked out of stock`, 'success');
    }
    setRowSelection({});
  };

  const confirmBulkDelete = async (): Promise<void> => {
    if (selectedCount === 0) {
      return;
    }
    try {
      await removeProducts([...selectedIds]);
      showToast(`${selectedCount} accessories deleted`, 'success');
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
            <h1 className="admin-page-heading">Accessories</h1>
            <p className="admin-page-subtitle mt-2 break-words">
              {client
                ? `Managing accessories for ${client.storeName}.`
                : isSuperadmin
                  ? 'Select a store from Clients to manage accessories.'
                  : 'Accessories'}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="btn-admin-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add accessory
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : rows.length === 0 ? (
          <div className="admin-table-shell">
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <Package className="size-16 text-white/20" aria-hidden />
              <h2 className="font-display text-2xl text-white/60">No accessories yet</h2>
              <p className="max-w-xs text-center text-sm text-white/40">
                Add cases, chargers, earphones and more to your store
              </p>
              <button type="button" onClick={openCreate} className="btn-admin-primary w-full sm:w-auto">
                + Add First Accessory
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
                  aria-label="Search accessories by name"
                />
              </div>
              <div className="flex min-w-[140px] flex-1 flex-col text-sm sm:flex-initial">
                <span className="sr-only">Category</span>
                <Select<CategoryFilterOption, false>
                  instanceId="accessories-category-filter"
                  inputId="accessories-category-filter"
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
                  instanceId="accessories-stock-filter"
                  inputId="accessories-stock-filter"
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
                  instanceId="accessories-sort-filter"
                  inputId="accessories-sort-filter"
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
              Showing {displayRows.length} of {rows.length} accessories
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
                  <p className="text-center text-sm text-white/60">No accessories match your search</p>
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
          title={modalMode === 'create' ? 'Add accessory' : 'Edit accessory'}
          categoryChoices={[...ACCESSORY_CATEGORIES]}
          mode={modalMode}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
        <ConfirmModal
          open={deleteTarget !== null}
          title="Delete Accessory"
          message={`Are you sure you want to delete "${deleteTarget?.name ?? ''}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            if (!deleteTarget) {
              setDeleteTarget(null);
              return;
            }
            void removeProduct(deleteTarget.id)
              .then(() => showToast('Accessory deleted', 'success'))
              .catch((err) =>
                showToast(err instanceof Error ? err.message : 'Delete failed', 'error'),
              )
              .finally(() => setDeleteTarget(null));
          }}
          onCancel={() => setDeleteTarget(null)}
        />
        <ConfirmModal
          open={bulkDeleteOpen}
          title="Delete accessories"
          message={`Delete ${selectedCount} accessories? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
        />
      </div>
    </PageTransition>
  );
}

