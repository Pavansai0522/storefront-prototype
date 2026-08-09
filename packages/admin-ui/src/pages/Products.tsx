import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from '@tanstack/react-table';
import Select from 'react-select';
import { CheckSquare, Pencil, Plus, Search, Smartphone, Trash2, UtensilsCrossed } from 'lucide-react';
import {
  LIQUOR_CATEGORIES,
  LIQUOR_LISTING_OPTIONS,
  PRODUCT_CATEGORIES,
  RESTAURANT_CATEGORIES,
  SKELETON_DELAY_MS,
  WATCHES_SUBCATEGORIES,
} from '../constants';
import { isLiquorStoreTemplate, isMobileStoreTemplate, isRestaurantStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import { useAdminData } from '../context/AdminDataContext';
import {
  SORT_KEY_OPTIONS,
  STOCK_FILTER_OPTIONS,
  useProducts,
  type CategoryFilterOption,
  type SortKeyOption,
  type StockFilterOption,
} from '../hooks';
import type { FeaturedGroup, Nullable, Product } from '../types';
import { getClientCurrency, formatClientMoney } from '../utils/clientCurrency';
import {
  normalizeRetailDollar,
  usesEmiPricing,
  usesRetailDecimals,
} from '../constants/countryCurrency';
import { LiquorProductThumb } from '../components/LiquorProductThumb';
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

function nextDealSort(products: Product[]): number {
  const dealRows = products.filter((p) => p.featuredGroup === 'deal');
  const maxSort = dealRows.reduce((max, p) => Math.max(max, p.featuredSort ?? 0), -1);
  return maxSort + 1;
}

function featuredFromWeeklyDeal(
  weeklyDeal: 'catalog' | 'deals',
  products: Product[],
  existing?: Product | null,
): { featuredGroup: FeaturedGroup | null; featuredSort: number | null } {
  if (weeklyDeal === 'deals') {
    const sort =
      existing?.featuredGroup === 'deal' && existing.featuredSort != null
        ? existing.featuredSort
        : nextDealSort(products);
    return { featuredGroup: 'deal', featuredSort: sort };
  }
  return { featuredGroup: null, featuredSort: null };
}

function featuredFromMobileCategory(
  category: string,
  existing?: Product | null,
): { featuredGroup: FeaturedGroup | null | undefined; featuredSort: number | null | undefined } {
  if (category === 'Trending') {
    return { featuredGroup: 'trending', featuredSort: 0 };
  }
  if (existing?.featuredGroup === 'trending') {
    return { featuredGroup: null, featuredSort: null };
  }
  return { featuredGroup: undefined, featuredSort: undefined };
}

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
  const isMobile = isMobileStoreTemplate(client?.template);
  const isRestaurant = isRestaurantStoreTemplate(client?.template);
  const currencyCode = client
    ? getClientCurrency(client)
    : isLiquor
      ? 'USD'
      : 'INR';
  const showEmi = usesEmiPricing(currencyCode) && !isRestaurant;
  const useRetailPrice = usesRetailDecimals(currencyCode);
  const productCategoryChoices = useMemo(() => {
    if (isLiquor) return LIQUOR_CATEGORIES;
    if (isWatches) return WATCHES_SUBCATEGORIES;
    if (isRestaurant) return RESTAURANT_CATEGORIES;
    return PRODUCT_CATEGORIES;
  }, [isLiquor, isWatches, isRestaurant]);

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
  const [dealToggleId, setDealToggleId] = useState<Nullable<string>>(null);

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

  const setProductListing = useCallback(
    async (product: Product, weeklyDeal: 'catalog' | 'deals'): Promise<void> => {
      if (!clientId) {
        showToast('No store selected for this product.', 'error');
        return;
      }
      const { featuredGroup, featuredSort } = featuredFromWeeklyDeal(weeklyDeal, rows, product);
      setDealToggleId(product.id);
      try {
        await saveProduct({
          ...product,
          featuredGroup,
          featuredSort,
        });
        showToast(
          weeklyDeal === 'deals' ? 'Added to Deals page' : 'Removed from Deals page',
          'success',
        );
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Update failed', 'error');
      } finally {
        setDealToggleId(null);
      }
    },
    [clientId, rows, saveProduct],
  );

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
        header: isRestaurant ? 'Dish' : 'Product',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex min-w-0 items-center gap-3">
              {isLiquor ? (
                <LiquorProductThumb src={p.image} alt={p.name} />
              ) : (
                <img
                  src={p.image ?? ''}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
                />
              )}
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
          const choices = isLiquor
            ? LIQUOR_CATEGORIES
            : isRestaurant
              ? RESTAURANT_CATEGORIES
              : isWatches
                ? WATCHES_SUBCATEGORIES
                : PRODUCT_CATEGORIES;
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
      ...(isLiquor
        ? [
            columnHelper.display({
              id: 'weeklyDeal',
              header: 'Deals page',
              cell: ({ row }) => {
                const p = row.original;
                const listing = p.featuredGroup === 'deal' ? 'deals' : 'catalog';
                const busy = dealToggleId === p.id;
                return (
                  <select
                    className="min-h-[44px] max-w-[220px] rounded-lg border border-white/10 bg-brand-bg px-2 py-2 text-sm text-gray-200 focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron disabled:opacity-50"
                    value={listing}
                    disabled={busy || !clientId}
                    aria-label={`Deals listing for ${p.name}`}
                    onChange={(e) => {
                      const next = e.target.value as 'catalog' | 'deals';
                      if (next === listing) {
                        return;
                      }
                      void setProductListing(p, next);
                    }}
                  >
                    {LIQUOR_LISTING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value === 'deals' ? 'Deals page' : 'Catalog only'}
                      </option>
                    ))}
                  </select>
                );
              },
            }),
          ]
        : []),
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
    [isLiquor, isRestaurant, isWatches, client, showEmi, useRetailPrice, clientId, dealToggleId, setProductListing],
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
    weeklyDeal: 'catalog' | 'deals';
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
      let imageUrl: string | null = values.image.trim() || null;

      if (values.imageFile) {
        imageUrl = await uploadProductImage(ownerId, productId, values.imageFile);
      }

      const subcategory = isWatches ? values.category : null;
      const category = (isWatches ? values.category : values.category) as Product['category'];

      const listingFields = isLiquor
        ? featuredFromWeeklyDeal(values.weeklyDeal, rows, modalMode === 'edit' ? editing : null)
        : isMobile
          ? featuredFromMobileCategory(values.category, modalMode === 'edit' ? editing : null)
          : {
              featuredGroup: modalMode === 'edit' && editing ? editing.featuredGroup : undefined,
              featuredSort: modalMode === 'edit' && editing ? editing.featuredSort : undefined,
            };

      if (isMobile && values.category === 'Trending') {
        for (const other of rows) {
          if (
            other.id !== productId &&
            (other.category === 'Trending' || other.featuredGroup === 'trending')
          ) {
            await saveProduct({
              ...other,
              category: 'Phone',
              featuredGroup: null,
              featuredSort: null,
            });
          }
        }
      }

      const shelfPrice = useRetailPrice ? normalizeRetailDollar(values.price) : values.price;

      const product: Product = {
        id: productId,
        clientId: ownerId,
        name: values.name,
        brand: values.brand,
        price: shelfPrice,
        emiPrice: isRestaurant ? 0 : values.emiPrice,
        image: imageUrl,
        inStock: values.inStock,
        category,
        subcategory,
        isAccessory: false,
        featuredGroup: listingFields.featuredGroup ?? undefined,
        featuredSort: listingFields.featuredSort ?? undefined,
      };

      await saveProduct(product);
      showToast(
        modalMode === 'create'
          ? isRestaurant
            ? 'Menu item added successfully'
            : 'Product added successfully'
          : isRestaurant
            ? 'Menu item updated successfully'
            : 'Product updated successfully',
        'success',
      );
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
            <h1 className="admin-page-heading">{isRestaurant ? 'Menu' : 'Products'}</h1>
            <p className="admin-page-subtitle mt-2 break-words">
              {client
                ? isRestaurant
                  ? `Managing menu for ${client.storeName}.`
                  : `Managing catalog for ${client.storeName}.`
                : isSuperadmin
                  ? isRestaurant
                    ? 'Select a store from Clients to manage its menu.'
                    : 'Select a store from Clients to manage its catalog.'
                  : isRestaurant
                    ? 'Menu'
                    : 'Products'}
              {isLiquor && client ? (
                <>
                  {' '}
                  Set <span className="text-white">Deals page</span> in the dropdown when adding or editing a product.
                </>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            disabled={isSuperadmin && !clientId}
            className="btn-admin-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {isRestaurant ? 'Add menu item' : 'Add product'}
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : rows.length === 0 ? (
          <div className="admin-table-shell">
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              {isRestaurant ? (
                <UtensilsCrossed className="size-16 text-white/20" aria-hidden />
              ) : (
                <Smartphone className="size-16 text-white/20" aria-hidden />
              )}
              <h2 className="font-display text-2xl text-white/60">
                {isRestaurant ? 'No menu items yet' : 'No products yet'}
              </h2>
              <p className="max-w-xs text-center text-sm text-white/40">
                {isLiquor
                  ? 'Add your first bottle or product to start building your catalog'
                  : isWatches
                    ? 'Add your first watch, toy, or accessory to start building your catalog'
                    : isRestaurant
                      ? 'Add your first dish to start building your menu'
                      : 'Add your first phone or device to start building your catalog'}
              </p>
              <button type="button" onClick={openCreate} className="btn-admin-primary w-full sm:w-auto">
                {isRestaurant ? '+ Add First Menu Item' : '+ Add First Product'}
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
                  aria-label={isRestaurant ? 'Search menu by name' : 'Search products by name'}
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
              Showing {displayRows.length} of {rows.length} {isRestaurant ? 'menu items' : 'products'}
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
                  <p className="text-center text-sm text-white/60">
                    {isRestaurant ? 'No menu items match your search' : 'No products match your search'}
                  </p>
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
          title={
            modalMode === 'create'
              ? isRestaurant
                ? 'Add menu item'
                : 'Add product'
              : isRestaurant
                ? 'Edit menu item'
                : 'Edit product'
          }
          categoryChoices={[...productCategoryChoices]}
          mode={modalMode}
          currencyCode={currencyCode}
          initial={editing}
          showWeeklyDealField={isLiquor}
          showEmiField={showEmi}
          brandLabel={isRestaurant ? 'Short description' : 'Brand'}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          saving={saving}
          allowImageUpload
        />
        <ConfirmModal
          open={deleteTarget !== null}
          title={isRestaurant ? 'Delete Menu Item' : 'Delete Product'}
          message={`Are you sure you want to delete "${deleteTarget?.name ?? ''}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => {
            if (deleteTarget) {
              void removeProduct(deleteTarget.id)
                .then(() =>
                  showToast(isRestaurant ? 'Menu item deleted' : 'Product deleted', 'success'),
                )
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
          title={isRestaurant ? 'Delete menu items' : 'Delete products'}
          message={`Delete ${selectedCount} ${isRestaurant ? 'menu item' : 'product'}${selectedCount === 1 ? '' : 's'}? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleteOpen(false)}
        />
      </div>
    </PageTransition>
  );
}


