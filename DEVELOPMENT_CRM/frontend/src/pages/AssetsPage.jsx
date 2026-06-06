import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Search, Plus, ChevronUp, ChevronDown, ArrowUpDown,
  Truck, Settings, Monitor, Wrench, X,
} from 'lucide-react';
import {
  ASSETS, ASSET_STATUSES, PRODUCT_FAMILIES, ASSET_ACCOUNTS, ASSET_PRODUCTS,
  accountById, productById, assetLevel, formatAssetDate,
} from '../utils/assetData';
import AssetStatusBadge from '../components/AssetStatusBadge';

const TYPE_ICON = { vehicle: Truck, equipment: Settings, it: Monitor, tool: Wrench };
const TYPE_FILTERS = ['Standard', 'Internal', 'Competitor'];

function assetTypeClass(a) {
  if (a.isCompetitor) return 'Competitor';
  if (a.isInternal) return 'Internal';
  return 'Standard';
}

const COLUMNS = [
  { key: 'name', label: 'Asset Name' },
  { key: 'account', label: 'Account' },
  { key: 'status', label: 'Status' },
  { key: 'serialNumber', label: 'Serial Number' },
  { key: 'installDate', label: 'Install Date' },
  { key: 'usageEndDate', label: 'Usage End Date' },
  { key: 'owner', label: 'Owner' },
];

export default function AssetsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Honor ?status= deep links from the sidebar quick links
  useEffect(() => {
    const s = searchParams.get('status');
    setStatusFilter(s && ASSET_STATUSES.includes(s) ? s : 'All');
  }, [searchParams]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [familyFilter, setFamilyFilter] = useState('All');
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);

  const q = search.trim().toLowerCase();

  const rows = useMemo(() => {
    let list = ASSETS.filter(a => {
      const acc = accountById(a.accountId);
      const matchesSearch = !q
        || a.name.toLowerCase().includes(q)
        || (a.serialNumber || '').toLowerCase().includes(q)
        || (acc?.name || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchesType = typeFilter === 'All' || assetTypeClass(a) === typeFilter;
      const matchesFamily = familyFilter === 'All' || productById(a.productId)?.family === familyFilter;
      return matchesSearch && matchesStatus && matchesType && matchesFamily;
    });
    const get = (a, key) => {
      switch (key) {
        case 'account': return accountById(a.accountId)?.name || '';
        case 'owner': return a.ownerId || '';
        default: return a[key] || '';
      }
    };
    list = [...list].sort((x, y) => {
      const xv = get(x, sort.key).toString().toLowerCase();
      const yv = get(y, sort.key).toString().toLowerCase();
      if (xv < yv) return sort.dir === 'asc' ? -1 : 1;
      if (xv > yv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [q, statusFilter, typeFilter, familyFilter, sort]);

  const toggleSort = (key) =>
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  return (
    <div className="p-6 max-w-screen-2xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Box size={20} style={{ color: 'var(--accent-dark)' }} />
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-main)' }}>Assets</h1>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)' }}>{rows.length}</span>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary px-4 py-2.5">
          <Plus size={16} /> New Asset
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}><Search size={15} /></span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, serial, or account…"
               className="input-field pl-9" style={{ minHeight: 40 }} />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <FilterGroup label="Status" value={statusFilter} options={['All', ...ASSET_STATUSES]} onChange={setStatusFilter} />
        <FilterGroup label="Type" value={typeFilter} options={['All', ...TYPE_FILTERS]} onChange={setTypeFilter} />
        <FilterGroup label="Family" value={familyFilter} options={['All', ...PRODUCT_FAMILIES]} onChange={setFamilyFilter} />
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-light)' }}>
              {COLUMNS.map(col => (
                <th key={col.key}
                    className="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
                    style={{ color: 'var(--text-muted)' }} onClick={() => toggleSort(col.key)}>
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sort.key === col.key
                      ? (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
                      : <ArrowUpDown size={11} style={{ opacity: 0.4 }} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No assets found.</td></tr>
            )}
            {rows.map(a => {
              const Icon = TYPE_ICON[a.assetType] || Box;
              const acc = accountById(a.accountId);
              const obsolete = a.status === 'Obsolete';
              return (
                <tr key={a.id} onClick={() => navigate(`/assets/${a.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)', opacity: obsolete ? 0.7 : 1 }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)' }}><Icon size={15} /></span>
                      <div className="min-w-0">
                        <div className="font-semibold truncate" style={{ color: 'var(--text-main)' }}>{a.name}</div>
                        <div className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{a.id} · L{assetLevel(a.id)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{acc?.name || '—'}</td>
                  <td className="px-4 py-3"><AssetStatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs">{a.serialNumber || '—'}</td>
                  <td className="px-4 py-3">{formatAssetDate(a.installDate)}</td>
                  <td className="px-4 py-3">{formatAssetDate(a.usageEndDate)}</td>
                  <td className="px-4 py-3">{a.ownerId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && <NewAssetModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] font-medium uppercase tracking-wider mr-0.5" style={{ color: 'var(--text-muted)' }}>{label}:</span>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
            style={active
              ? { backgroundColor: 'var(--accent)', color: '#1a1a1a' }
              : { backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* New Asset modal — Account/Contact requirement validation (FRD §6.2) */
function NewAssetModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', accountId: '', contactId: '', productId: '', serialNumber: '',
    status: 'Purchased', location: '',
  });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const product = productById(form.productId);
  const submit = () => {
    if (!form.accountId && !form.contactId) {
      setError('An asset must be associated with an Account or a Contact.');
      return;
    }
    // Asset Name auto-population from Product (FRD §6.1)
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
           style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <Box size={17} style={{ color: 'var(--accent-dark)' }} /> New Asset
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        {error && (
          <div className="mx-5 mt-4 px-3 py-2 rounded text-sm" style={{ backgroundColor: '#fce8e6', color: '#c5221f' }}>{error}</div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Asset Name">
            <input className="input-field" value={form.name} onChange={set('name')} placeholder={product ? product.name : 'Auto from Product if blank'} />
          </Field>
          <Field label="Status">
            <select className="input-field" value={form.status} onChange={set('status')}>{ASSET_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
          </Field>
          <Field label="Account *">
            <select className="input-field" value={form.accountId} onChange={set('accountId')}>
              <option value="">— Select —</option>
              {ASSET_ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </Field>
          <Field label="Product">
            <select className="input-field" value={form.productId} onChange={set('productId')}>
              <option value="">— None —</option>
              {ASSET_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Serial Number">
            <input className="input-field" value={form.serialNumber} onChange={set('serialNumber')} placeholder="VIN / serial" />
          </Field>
          <Field label="Location">
            <input className="input-field" value={form.location} onChange={set('location')} placeholder="Depot / yard / site" />
          </Field>
          {product && (
            <div className="sm:col-span-2 rounded-lg p-3 text-xs" style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
              <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Product-derived (read-only)</div>
              <div className="grid grid-cols-3 gap-2 font-mono" style={{ color: 'var(--text-tertiary)' }}>
                <span>Code: {product.code}</span><span>Family: {product.family}</span><span>SKU: {product.sku}</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="btn-secondary px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="btn-primary px-4 py-2 text-sm" onClick={submit}>Create Asset</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      {children}
    </label>
  );
}
