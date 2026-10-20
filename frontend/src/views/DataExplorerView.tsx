import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { PageTransition } from '@/components/common/PageTransition';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { NoticeBanner } from '@/components/common/NoticeBanner';
import {
  brandRevenue,
  categoryRevenue,
  topProducts,
} from '@/data';
import type { BrandRevenueRecord } from '@/types/analytics';
import {
  formatInteger,
  formatMonetaryValue,
  formatPercent,
} from '@/utils/formatters';
import { buildSafeCsv, downloadCsv } from '@/utils/csvExport';
import {
  Search,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  ShoppingBag,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  XCircle,
} from 'lucide-react';

type TabType = 'brands' | 'categories' | 'products';
type SortField = 'rank' | 'brand' | 'total_revenue' | 'purchase_events' | 'unique_buyers' | 'aov' | 'revenue_share_percentage';
type SortDirection = 'asc' | 'desc';
type TierFilter = 'all' | 'tier1' | 'tier2' | 'tier3' | 'tier4';
type ProductSortMode = 'revenue' | 'volume';

interface BrandWithAOV extends BrandRevenueRecord {
  aov: number;
}

export const DataExplorerView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'categories' || tab === 'products') return tab;
    return 'brands';
  });

  // Brand table states
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('brand') || '');
  const [tierFilter, setTierFilter] = useState<TierFilter>(() => {
    const tier = searchParams.get('tier');
    if (tier === 'tier1' || tier === 'tier2' || tier === 'tier3' || tier === 'tier4') return tier;
    return 'all';
  });
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Synchronize state if URL search parameters change dynamically
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const tabParam = searchParams.get('tab') as TabType | null;
    const tierParam = searchParams.get('tier') as TierFilter | null;

    if (brandParam) {
      setSearchTerm(brandParam);
      setActiveTab('brands');
      setCurrentPage(1);
    }
    if (tabParam && (tabParam === 'brands' || tabParam === 'categories' || tabParam === 'products')) {
      setActiveTab(tabParam);
    }
    if (tierParam && ['all', 'tier1', 'tier2', 'tier3', 'tier4'].includes(tierParam)) {
      setTierFilter(tierParam);
      setActiveTab('brands');
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Product tab state
  const [productSortMode, setProductSortMode] = useState<ProductSortMode>('revenue');

  // Filter and sort brands
  const filteredBrands: BrandWithAOV[] = useMemo(() => {
    return brandRevenue
      .filter((b: BrandRevenueRecord) => {
        // Search term filter
        if (searchTerm.trim() && !b.brand.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
          return false;
        }

        // Tier filter
        if (tierFilter === 'tier1' && b.total_revenue < 10000000) return false;
        if (tierFilter === 'tier2' && (b.total_revenue < 1000000 || b.total_revenue >= 10000000)) return false;
        if (tierFilter === 'tier3' && (b.total_revenue < 100000 || b.total_revenue >= 1000000)) return false;
        if (tierFilter === 'tier4' && b.total_revenue >= 100000) return false;

        return true;
      })
      .map((b: BrandRevenueRecord) => ({
        ...b,
        aov: b.purchase_events > 0 ? b.total_revenue / b.purchase_events : 0,
      }))
      .sort((a: BrandWithAOV, b: BrandWithAOV) => {
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;

        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchTerm, tierFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBrands.length / rowsPerPage) || 1;
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBrands.slice(start, start + rowsPerPage);
  }, [filteredBrands, currentPage, rowsPerPage]);

  // Handle sort header click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'brand' || field === 'rank' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  // Safe CSV Export Function with formula injection escaping
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Brand',
      'Recorded Value (monetary units)',
      'Purchase Orders',
      'Unique Buyers',
      'Average Order Value',
      'Revenue Share (%)',
    ];

    const rows = filteredBrands.map((b: BrandWithAOV) => [
      b.rank,
      b.brand,
      Number(b.total_revenue.toFixed(2)),
      b.purchase_events,
      b.unique_buyers,
      Number(b.aov.toFixed(2)),
      Number(b.revenue_share_percentage.toFixed(4)),
    ]);

    const csvContent = buildSafeCsv(headers, rows);
    downloadCsv(`commerceiq_brands_${tierFilter}_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  // Safe CSV Export for Category Hierarchy
  const handleExportCategoriesCSV = () => {
    const headers = [
      'Rank',
      'Category Name',
      'Recorded Value (monetary units)',
      'Purchase Orders',
      'Unique Buyers',
      'Average Order Value',
      'Revenue Share (%)',
    ];

    const rows = categoryRevenue.map((cat, idx) => [
      idx + 1,
      cat.main_category,
      Number(cat.total_revenue.toFixed(2)),
      cat.purchase_events,
      cat.unique_buyers,
      Number((cat.purchase_events > 0 ? cat.total_revenue / cat.purchase_events : 0).toFixed(2)),
      Number(cat.revenue_share_percentage.toFixed(4)),
    ]);

    const csvContent = buildSafeCsv(headers, rows);
    downloadCsv(`commerceiq_categories_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-brand-cyan" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-cyan" />
    );
  };

  return (
    <PageTransition>
      <PageHeader
        title="Data Explorer & Merchandising Catalog"
        category="Catalog Analytics"
        description="Tabular exploration and merchandising performance across 1,985 recorded brands, 14 categories, and individual product leaders."
      />

      {/* Active Connected Drill-Down Filter Notification */}
      {(searchParams.get('brand') || searchParams.get('category') || searchParams.get('tier')) && (
        <div className="mb-6 p-3.5 rounded-xl bg-brand-violet/15 border border-brand-violet/40 flex items-center justify-between gap-3 text-xs text-text-primary shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-md bg-brand-cyan/20 text-brand-cyan">
              <Filter className="w-4 h-4" />
            </span>
            <span>
              Connected Drill-Down from Sales Intelligence:{' '}
              <span className="font-semibold text-brand-cyan">
                {searchParams.get('brand') ? `Brand “${searchParams.get('brand')}”` : ''}
                {searchParams.get('category') ? `Category “${searchParams.get('category')}”` : ''}
                {searchParams.get('tier') ? `Revenue Tier “${searchParams.get('tier')}”` : ''}
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchParams({});
              setSearchTerm('');
              setTierFilter('all');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-text-primary text-xs font-medium transition-colors"
          >
            <XCircle className="w-3.5 h-3.5 text-text-subtle" />
            <span>Reset Filter</span>
          </button>
        </div>
      )}

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-hairline/80 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'brands'
              ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/40 shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Brand Performance ({brandRevenue.length.toLocaleString()})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/40 shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Category Hierarchy ({categoryRevenue.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-brand-violet/20 text-brand-cyan border border-brand-violet/40 shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-subtle'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Product Leaders</span>
        </button>
      </div>

      {/* TAB 1: BRANDS EXPLORER */}
      {activeTab === 'brands' && (
        <SurfaceCard variant="default" className="mb-8">
          {/* Toolbar: Search, Filters, Export */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 pb-4 border-b border-hairline">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by brand name (e.g. apple, sony, bosch)..."
                  className="w-full bg-slate-900/90 text-sm text-text-primary pl-9 pr-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-brand-violet focus:border-brand-violet placeholder:text-text-subtle"
                />
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-text-subtle" />
                <select
                  value={tierFilter}
                  onChange={(e) => {
                    setTierFilter(e.target.value as TierFilter);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900/90 text-xs text-text-primary px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-brand-violet"
                >
                  <option value="all">All Revenue Tiers ({brandRevenue.length})</option>
                  <option value="tier1">Tier 1: &gt; 10M units</option>
                  <option value="tier2">Tier 2: 1M – 10M units</option>
                  <option value="tier3">Tier 3: 100k – 1M units</option>
                  <option value="tier4">Tier 4: &lt; 100k units</option>
                </select>
              </div>
            </div>

            {/* Export and Record Count */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs font-mono text-text-muted">
                Showing <strong className="text-brand-cyan">{filteredBrands.length.toLocaleString()}</strong> of {brandRevenue.length.toLocaleString()} brands
              </span>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-subtle hover:bg-slate-800 text-text-primary border border-white/10 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Interactive Data Table */}
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-surface-subtle text-text-muted text-xs uppercase tracking-wider font-semibold border-b border-hairline select-none">
                <tr>
                  <th
                    onClick={() => handleSort('rank')}
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Rank</span>
                      {renderSortIcon('rank')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('brand')}
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Brand</span>
                      {renderSortIcon('brand')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('total_revenue')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Recorded Value</span>
                      {renderSortIcon('total_revenue')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('purchase_events')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Orders</span>
                      {renderSortIcon('purchase_events')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('unique_buyers')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Unique Buyers</span>
                      {renderSortIcon('unique_buyers')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('aov')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Avg Order Value</span>
                      {renderSortIcon('aov')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('revenue_share_percentage')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors group"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Platform Share</span>
                      {renderSortIcon('revenue_share_percentage')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/60">
                {paginatedBrands.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-subtle text-sm">
                      No brands match the query &ldquo;{searchTerm}&rdquo; within the selected tier filter.
                    </td>
                  </tr>
                ) : (
                  paginatedBrands.map((b: BrandWithAOV) => (
                    <tr key={b.brand} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-text-subtle">#{b.rank}</td>
                      <td className="py-3 px-4 font-medium text-text-primary capitalize flex items-center gap-2">
                        <span>{b.brand}</span>
                        {b.brand === 'Unknown' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-text-subtle font-normal font-sans">
                            Unbranded
                          </span>
                        )}
                        {(b.rank ?? 999) <= 5 && (
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                            TOP 5
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-brand-cyan">
                        {formatMonetaryValue(b.total_revenue, true)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-text-muted">
                        {formatInteger(b.purchase_events)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-text-muted">
                        {formatInteger(b.unique_buyers)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {b.aov.toFixed(2)} units
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-brand-violet-light font-medium">
                        {formatPercent(b.revenue_share_percentage)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="mt-4 pt-4 border-t border-hairline/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-text-subtle">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-900 text-xs text-text-primary px-2 py-1 rounded border border-white/10 focus:outline-none"
              >
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="ml-2 font-mono">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-1 self-center sm:self-auto">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-mono font-medium text-text-primary bg-slate-900 rounded border border-white/10">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </SurfaceCard>
      )}

      {/* TAB 2: CATEGORY HIERARCHY */}
      {activeTab === 'categories' && (
        <SurfaceCard variant="default" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <SectionHeading
              title="Complete Category Performance Catalog"
              subtitle="Breakdown of all 14 recognized product categories sorted by recorded purchase value."
              className="mb-0"
            />
            <button
              type="button"
              onClick={handleExportCategoriesCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-subtle hover:bg-slate-800 text-text-primary border border-white/10 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Export Categories CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-hairline mt-4">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-surface-subtle text-text-muted text-xs uppercase tracking-wider font-semibold border-b border-hairline">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4 text-right">Recorded Value</th>
                  <th className="py-3 px-4 text-right">Purchase Orders</th>
                  <th className="py-3 px-4 text-right">Unique Buyers</th>
                  <th className="py-3 px-4 text-right">Avg Order Value</th>
                  <th className="py-3 px-4 text-right">Revenue Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/60">
                {categoryRevenue.map((cat, idx) => {
                  const aov = cat.purchase_events > 0 ? cat.total_revenue / cat.purchase_events : 0;
                  return (
                    <tr
                      key={cat.main_category}
                      className={`transition-colors ${
                        searchParams.get('category')?.toLowerCase() === cat.main_category.toLowerCase()
                          ? 'bg-brand-violet/20 border-l-4 border-l-brand-cyan ring-1 ring-brand-violet/40'
                          : 'hover:bg-surface-elevated/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-text-subtle">#{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-text-primary capitalize flex items-center gap-2">
                        <span>{cat.main_category}</span>
                        {idx === 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/20 text-brand-cyan">
                            DOMINANT CATEGORY (76.7%)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-brand-cyan">
                        {formatMonetaryValue(cat.total_revenue, true)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-text-muted">
                        {formatInteger(cat.purchase_events)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-text-muted">
                        {formatInteger(cat.unique_buyers)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {aov.toFixed(2)} units
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-brand-violet-light font-medium">
                        {formatPercent(cat.revenue_share_percentage)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex items-center justify-between">
            <span>Electronics generates 76.74% of revenue, followed by unclassified category at 9.97%.</span>
            <span className="font-mono text-brand-cyan">Total: 14 primary product branches</span>
          </div>
        </SurfaceCard>
      )}

      {/* TAB 3: TOP PRODUCTS LEADERBOARDS */}
      {activeTab === 'products' && (
        <div className="space-y-6 mb-8">
          {/* Sub-selector */}
          <div className="flex items-center justify-between">
            <SectionHeading
              title="Individual Product Leaders"
              subtitle="Comparison of high-value flagship items versus high-velocity volume drivers."
              className="mb-0"
            />
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => setProductSortMode('revenue')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  productSortMode === 'revenue'
                    ? 'bg-brand-violet/30 text-brand-violet-light border border-brand-violet/40'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Top by Revenue (Value)
              </button>
              <button
                type="button"
                onClick={() => setProductSortMode('volume')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  productSortMode === 'volume'
                    ? 'bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/40'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Top by Order Volume (Units)
              </button>
            </div>
          </div>

          <SurfaceCard variant="default">
            <div className="overflow-x-auto rounded-xl border border-hairline">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-surface-subtle text-text-muted text-xs uppercase tracking-wider font-semibold border-b border-hairline">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Product Identifier</th>
                    <th className="py-3 px-4 text-right">Recorded Value</th>
                    <th className="py-3 px-4 text-right">Purchase Orders</th>
                    <th className="py-3 px-4 text-right">Unique Buyers</th>
                    <th className="py-3 px-4 text-right">Average Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/60">
                  {(productSortMode === 'revenue' ? topProducts.by_revenue : topProducts.by_volume).map((p, idx) => (
                    <tr key={p.product_id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-text-subtle">#{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-brand-cyan">Product #{p.product_id}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-text-primary">
                        {formatMonetaryValue(p.total_revenue, true)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400">
                        {formatInteger(p.purchase_events)} orders
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-text-muted">
                        {formatInteger(p.unique_buyers)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-brand-violet-light">
                        {p.average_price.toFixed(2)} units
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex items-center justify-between">
              <span>Product #1005115 generates the highest recorded revenue; Product #1004856 drives the highest order count.</span>
              <span className="font-mono text-brand-cyan">Source: top_products_summary.csv</span>
            </div>
          </SurfaceCard>
        </div>
      )}

      {/* Transparency Note */}
      <NoticeBanner
        type="info"
        title="Merchandising Provenance"
        message="All brand, category, and product statistics represent historical aggregations from the October 2019 logs. Product titles and images were not captured in the source telemetry and are omitted to avoid speculation."
      />
    </PageTransition>
  );
};
