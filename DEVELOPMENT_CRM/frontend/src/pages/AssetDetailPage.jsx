import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronDown, ChevronRight, ChevronUp, Edit, MoreVertical, Search,
  Truck, Settings, Monitor, Wrench, MapPin, Copy, Check, ExternalLink, Plus,
  GitBranch, FileText, Network,
} from 'lucide-react';
import {
  ASSETS, ASSET_ACCOUNTS, ASSET_STATUSES,
  assetById, accountById, productById, childrenOf, ancestorChain, assetLevel, rootAsset,
  primaryRelationships, relatedRelationships,
  casesForAsset, workOrdersForAsset, appointmentsForAsset, historyForAsset, filesForAsset,
  formatAssetDate, formatAssetDateTime, formatAssetCurrency, isUsageEndingSoon, isOverdue,
} from '../utils/assetData';
import AssetStatusBadge from '../components/AssetStatusBadge';

const TYPE_ICON = { vehicle: Truck, equipment: Settings, it: Monitor, tool: Wrench };

export default function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseAsset = assetById(id);
  const [statusOverride, setStatusOverride] = useState(null);
  const [extraHistory, setExtraHistory] = useState([]);

  // Reset transient state when navigating between assets
  useEffect(() => { setStatusOverride(null); setExtraHistory([]); }, [id]);

  if (!baseAsset) {
    return <div className="p-6" style={{ color: 'var(--text-main)' }}>Asset not found. <button className="underline" onClick={() => navigate('/assets')}>Back to Assets</button></div>;
  }

  const asset = { ...baseAsset, status: statusOverride || baseAsset.status };

  const handleStatusChange = (newStatus) => {
    if (newStatus === asset.status) return;
    setExtraHistory(prev => [
      { user: 'YOU', action: 'Status changed', detail: `${asset.status} → ${newStatus}`, ts: new Date().toISOString(), group: 'Today' },
      ...prev,
    ]);
    setStatusOverride(newStatus);
  };

  return (
    <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 4rem)', backgroundColor: 'var(--bg-base)' }}>
      <UnitSelectorSidebar currentId={id} navigate={navigate} />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <MainPanel asset={asset} navigate={navigate} onStatusChange={handleStatusChange} />
        <RightPanel asset={asset} navigate={navigate} extraHistory={extraHistory} />
      </div>
    </div>
  );
}

/* ── LEFT: Account / Unit selector (DESIGN §3) ─────────────────────── */
function UnitSelectorSidebar({ currentId, navigate }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const currentAsset = assetById(currentId);
  const [collapsed, setCollapsed] = useState({});

  const q = search.trim().toLowerCase();
  const groups = useMemo(() => {
    return ASSET_ACCOUNTS.map(acc => {
      const units = ASSETS.filter(a => a.accountId === acc.id).filter(a => {
        const matchesSearch = !q || a.name.toLowerCase().includes(q) || acc.name.toLowerCase().includes(q);
        const matchesFilter = filter === 'All'
          || (filter === 'Active' && a.status !== 'Obsolete')
          || (filter === 'Obsolete' && a.status === 'Obsolete');
        return matchesSearch && matchesFilter;
      });
      return { acc, units };
    }).filter(g => g.units.length > 0);
  }, [q, filter]);

  const toggle = (accId) => setCollapsed(c => ({ ...c, [accId]: !c[accId] }));

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col overflow-hidden"
           style={{ borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
      <div className="p-3 space-y-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}><Search size={13} /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search units or accounts…"
                 className="w-full pl-8 pr-2 py-1.5 rounded-md text-xs"
                 style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Filter</div>
          <div className="flex gap-1.5">
            {['All', 'Active', 'Obsolete'].map(f => (
              <button key={f} type="button" onClick={() => setFilter(f)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
                style={filter === f
                  ? { backgroundColor: 'var(--accent)', color: '#1a1a1a' }
                  : { backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {groups.map(({ acc, units }) => {
          const isCollapsed = collapsed[acc.id];
          return (
            <div key={acc.id} className="mb-1">
              <button type="button" onClick={() => toggle(acc.id)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-left">
                {isCollapsed ? <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                <span className="text-[11px] font-semibold uppercase tracking-wider truncate" style={{ color: 'var(--text-secondary)' }}>{acc.name}</span>
              </button>
              {!isCollapsed && units.map(u => {
                const Icon = TYPE_ICON[u.assetType] || Truck;
                const active = u.id === currentId;
                return (
                  <button key={u.id} type="button" onClick={() => navigate(`/assets/${u.id}`)}
                    className="w-full flex items-center gap-2 pr-3 py-2 text-left transition-colors"
                    style={{
                      paddingLeft: 28,
                      backgroundColor: active ? 'var(--accent-pale)' : 'transparent',
                      borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--bg-light)'; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <Icon size={15} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
                    <span className="text-xs truncate flex-1" style={{ color: 'var(--text-main)' }}>{u.name}</span>
                    <AssetStatusBadge status={u.status} size="xs" />
                  </button>
                );
              })}
            </div>
          );
        })}
        {groups.length === 0 && <p className="px-3 text-xs" style={{ color: 'var(--text-muted)' }}>No matching units.</p>}
      </div>
    </aside>
  );
}

/* ── MAIN PANEL (DESIGN §4) ─────────────────────────────────────────── */
function MainPanel({ asset, navigate, onStatusChange }) {
  const acc = accountById(asset.accountId);
  const product = productById(asset.productId);
  const [statusMenu, setStatusMenu] = useState(false);
  const Icon = TYPE_ICON[asset.assetType] || Truck;

  return (
    <div className="flex-[4] overflow-y-auto flex flex-col gap-3 min-w-0">
      {/* Header bar */}
      <div className="rounded-lg px-5 py-3 flex items-center justify-between gap-3 sticky top-0 z-10"
           style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/assets')} className="flex items-center gap-1 text-xs hover:underline" style={{ color: 'var(--text-link, var(--accent-dark))' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}><Icon size={20} /></span>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate" style={{ color: 'var(--text-main)' }}>{asset.name}</h1>
            <div className="text-xs font-mono truncate" style={{ color: 'var(--text-tertiary)' }}>{asset.id} · {acc?.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status dropdown */}
          <div className="relative">
            <button onClick={() => setStatusMenu(o => !o)} className="flex items-center gap-1">
              <AssetStatusBadge status={asset.status} />
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </button>
            {statusMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 rounded-lg py-1 z-20"
                     style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  {ASSET_STATUSES.map(s => (
                    <button key={s} onClick={() => { onStatusChange(s); setStatusMenu(false); }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-left hover:bg-gray-500/10"
                      style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-2"><AssetStatusBadge status={s} size="xs" /></span>
                      {s === asset.status && <Check size={13} style={{ color: 'var(--accent-dark)' }} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button className="btn-secondary px-3 py-1.5 text-sm"><Edit size={13} /> Edit</button>
          <button className="p-2 rounded-lg" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}><MoreVertical size={15} /></button>
        </div>
      </div>

      {/* Asset Information */}
      <Card title="Asset Information">
        <Grid cols={2}>
          <FieldRow label="Asset Name" value={asset.name} />
          <FieldRow label="Status" value={<AssetStatusBadge status={asset.status} />} />
          <FieldRow label="Account" value={acc?.name} link onClick={() => {}} />
          <FieldRow label="Contact" value={asset.contactId || '—'} />
          <FieldRow label="Serial Number" value={asset.serialNumber} mono copyable />
          <FieldRow label="Location" value={asset.location} icon={<MapPin size={13} />} />
          <FieldRow label="Asset Owner" value={asset.ownerId} />
          <FieldRow label="Install Date" value={formatAssetDate(asset.installDate)} />
        </Grid>
      </Card>

      {/* Product Details */}
      <Card title="Product Details">
        {product ? (
          <>
            <Grid cols={2}>
              <FieldRow label="Product" value={product.name} link onClick={() => {}} />
              <FieldRow label="Product Code" value={product.code} mono />
              <FieldRow label="Product Family" value={product.family} />
              <FieldRow label="Product SKU" value={product.sku} mono />
            </Grid>
            <div className="mt-3">
              <FieldRow label="Product Description" value={product.description} />
            </div>
          </>
        ) : <Empty text="No product linked." />}
      </Card>

      {/* Dates & Financials */}
      <Card title="Dates & Financials">
        <Grid cols={3}>
          <FieldRow label="Purchase Date" value={formatAssetDate(asset.purchaseDate)} />
          <FieldRow label="Install Date" value={formatAssetDate(asset.installDate)} />
          <FieldRow label="Usage End Date" value={formatAssetDate(asset.usageEndDate)} warn={isUsageEndingSoon(asset.usageEndDate)} />
          <FieldRow label="Price" value={formatAssetCurrency(asset.price)} />
          <FieldRow label="Quantity" value={asset.quantity} />
        </Grid>
      </Card>

      {/* Classification */}
      <Card title="Classification">
        <Grid cols={2}>
          <FieldRow label="Competitor Asset"
            value={asset.isCompetitor
              ? <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#fce8e6', color: '#c5221f' }}>Yes — competitor product</span>
              : 'No'} />
          <FieldRow label="Internal Asset"
            value={asset.isInternal
              ? <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#e6f4ea', color: '#137333' }}>Yes — internal</span>
              : 'No'} />
          <FieldRow label="Asset Provided By" value={accountById(asset.manufacturerId)?.name || '—'} link={!!asset.manufacturerId} />
          <FieldRow label="Asset Serviced By" value={accountById(asset.servicedById)?.name || '—'} link={!!asset.servicedById} />
        </Grid>
      </Card>

      {/* Hierarchy */}
      <Card title="Hierarchy">
        <HierarchyMiniTree asset={asset} navigate={navigate} />
      </Card>

      {/* Child Assets related list */}
      <Card title={`Child Assets (${childrenOf(asset.id).length})`}>
        {childrenOf(asset.id).length === 0 ? <Empty text="No child assets." /> : (
          <div className="space-y-1.5">
            {childrenOf(asset.id).map(c => (
              <button key={c.id} onClick={() => navigate(`/assets/${c.id}`)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left"
                style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-main)' }}>
                  {c.name} <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>L{assetLevel(c.id)}</span>
                </span>
                <span className="flex items-center gap-2"><AssetStatusBadge status={c.status} size="xs" /><ChevronRight size={14} style={{ color: 'var(--text-muted)' }} /></span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Asset Relationships */}
      <Card title="Asset Relationships">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <RelHeader label="Primary (this is successor)" />
            <RelList rels={primaryRelationships(asset.id)} navigate={navigate} other={(r) => r.relatedAssetId} />
          </div>
          <div>
            <RelHeader label="Related (this is predecessor)" />
            <RelList rels={relatedRelationships(asset.id)} navigate={navigate} other={(r) => r.assetId} />
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card title="Description">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{asset.description || '—'}</p>
      </Card>

      {/* System Information */}
      <Card title="System Information" defaultCollapsed>
        <Grid cols={2}>
          <FieldRow label="Asset Division" value={asset.division} />
          <FieldRow label="Asset Owner" value={asset.ownerId} />
          <FieldRow label="Asset Level (R/O)" value={`Level ${assetLevel(asset.id)}`} />
          <FieldRow label="Root Asset (R/O)" value={rootAsset(asset.id)?.name} />
          <FieldRow label="Created By" value="System Admin · 03 Jun 2026" />
          <FieldRow label="Last Modified By" value="Jane Carter · 06 Jun 2026" />
        </Grid>
      </Card>
    </div>
  );
}

function HierarchyMiniTree({ asset, navigate }) {
  const chain = ancestorChain(asset.id);
  return (
    <div>
      <div className="space-y-1">
        {chain.map((node, i) => {
          const isCurrent = node.id === asset.id;
          return (
            <button key={node.id} onClick={() => !isCurrent && navigate(`/assets/${node.id}`)}
              className="flex items-center gap-2 text-left"
              style={{ paddingLeft: i * 16, cursor: isCurrent ? 'default' : 'pointer' }}>
              <span className="flex items-center gap-1.5">
                {i === 0 && <Network size={13} style={{ color: 'var(--text-tertiary)' }} />}
                <span className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: isCurrent ? 'var(--accent)' : 'transparent', border: isCurrent ? 'none' : '1.5px solid var(--text-tertiary)' }} />
              </span>
              <span className="text-sm" style={{ color: isCurrent ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: isCurrent ? 600 : 400 }}>
                {node.name}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                L{assetLevel(node.id)}{node.id === chain[0].id && !node.parentId ? ' · Root' : ''}{isCurrent ? ' · THIS' : ''}
              </span>
            </button>
          );
        })}
      </div>
      <button onClick={() => navigate(`/assets/${asset.id}/hierarchy`)}
        className="mt-3 text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--accent-dark)' }}>
        <GitBranch size={12} /> View Full Hierarchy
      </button>
    </div>
  );
}

function RelHeader({ label }) {
  return <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
    {label}
    <button className="hover:underline normal-case" style={{ color: 'var(--accent-dark)' }}>+ Add</button>
  </div>;
}

function RelList({ rels, navigate, other }) {
  if (!rels.length) return <p className="text-xs" style={{ color: 'var(--text-muted)' }}>None.</p>;
  return (
    <div className="space-y-1.5">
      {rels.map(r => {
        const o = assetById(other(r));
        return (
          <button key={r.id} onClick={() => o && navigate(`/assets/${o.id}`)}
            className="w-full px-3 py-2 rounded-lg text-left" style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
            <div className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{o?.name || other(r)}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{r.type} · from {formatAssetDate(r.fromDate)}{r.toDate ? ` → ${formatAssetDate(r.toDate)}` : ''}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ── RIGHT PANEL widgets (DESIGN §5) ────────────────────────────────── */
function RightPanel({ asset, navigate, extraHistory }) {
  const acc = accountById(asset.accountId);
  const cases = casesForAsset(asset.id);
  const wos = workOrdersForAsset(asset.id);
  const sas = appointmentsForAsset(asset.id);
  const history = [...extraHistory, ...historyForAsset(asset.id)];
  const files = filesForAsset(asset.id);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3" style={{ minWidth: 220, maxWidth: 300 }}>
      <div className="px-1">
        <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Related</div>
        <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{asset.name}</div>
      </div>

      {/* Account Info */}
      <Widget title="Account Info" action={<ExternalLink size={13} />}>
        {acc ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)' }}>
                {acc.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{acc.name}</span>
            </div>
            <WRow label="Industry" value={acc.industry} />
            <WRow label="Phone" value={acc.phone} />
            <WRow label="Owner" value={acc.owner} />
            <WRow label="Since" value={formatAssetDate(acc.since)} />
            <WRow label="SLA Tier" value={
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: acc.sla === 'Gold' ? 'var(--accent-pale)' : 'var(--bg-light)', color: acc.sla === 'Gold' ? 'var(--accent-dark)' : 'var(--text-tertiary)' }}>
                {acc.sla} {acc.sla === 'Gold' ? '★' : ''}
              </span>} />
          </>
        ) : <Empty text="No account." />}
      </Widget>

      {/* Past Cases */}
      <Widget title={`Past Cases (${cases.length})`} action={<ChevronRight size={13} />}>
        {cases.length === 0 ? <Empty text="No cases." /> : cases.map(c => (
          <ListItem key={c.id} onClick={() => navigate(`/cases/${encodeURIComponent(c.id)}`)}
            dot={c.status === 'Open' ? '#ea4335' : c.status === 'In Progress' ? '#fbbc04' : '#34a853'}
            id={c.id} sub={c.subject} meta={`${c.status} · ${formatAssetDate(c.date)}`} />
        ))}
      </Widget>

      {/* Work Orders */}
      <Widget title={`Work Orders (${wos.length})`} action={<ChevronRight size={13} />}>
        {wos.length === 0 ? <Empty text="No work orders." /> : wos.map(w => (
          <ListItem key={w.id} onClick={() => navigate(`/workorders/${encodeURIComponent(w.id)}`)}
            id={w.id} sub={w.subject}
            meta={<span style={{ color: isOverdue(w.due) && w.status !== 'Completed' ? '#c5221f' : 'var(--text-secondary)' }}>{w.status} · Due {formatAssetDate(w.due)}</span>} />
        ))}
      </Widget>

      {/* Service Appointments */}
      <Widget title={`Service Appts (${sas.length})`} action={<ChevronRight size={13} />}>
        {sas.length === 0 ? <Empty text="No appointments." /> : sas.map(s => (
          <ListItem key={s.id} onClick={() => navigate(`/serviceappointments/${encodeURIComponent(s.id)}`)}
            id={s.id} sub={s.subject} meta={`${s.status} · ${formatAssetDateTime(s.when)}`} />
        ))}
      </Widget>

      {/* History */}
      <Widget title="History">
        {history.length === 0 ? <Empty text="No history." /> : history.map((h, i) => (
          <div key={i} className="flex gap-2 py-1.5" style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)' }}>{h.user}</span>
            <div className="min-w-0">
              <div className="text-xs font-medium" style={{ color: 'var(--text-main)' }}>{h.action}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{h.detail}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{formatAssetDateTime(h.ts)}</div>
            </div>
          </div>
        ))}
      </Widget>

      {/* Files */}
      <Widget title={`Files (${files.length})`} action={<Plus size={13} />}>
        {files.length === 0 ? <Empty text="No files." /> : files.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5">
            <FileText size={14} style={{ color: 'var(--text-tertiary)' }} />
            <div className="min-w-0">
              <div className="text-xs truncate" style={{ color: 'var(--text-main)' }}>{f.name}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{f.size} · {f.date}</div>
            </div>
          </div>
        ))}
        {files.length > 3 && <div className="text-[11px] mt-1" style={{ color: 'var(--accent-dark)' }}>+ {files.length - 3} more files →</div>}
      </Widget>
    </div>
  );
}

/* ── Shared bits ────────────────────────────────────────────────────── */
function Card({ title, children, defaultCollapsed = false }) {
  const [open, setOpen] = useState(!defaultCollapsed);
  return (
    <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 h-10"
        style={{ borderBottom: open ? '1px solid var(--border)' : 'none' }}>
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{title}</span>
        {open ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

function Grid({ cols, children }) {
  const cls = cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  return <div className={`grid grid-cols-1 ${cls} gap-x-8 gap-y-3`}>{children}</div>;
}

function FieldRow({ label, value, mono, link, icon, copyable, warn, onClick }) {
  const [copied, setCopied] = useState(false);
  const doCopy = (e) => { e.stopPropagation(); navigator.clipboard?.writeText(String(value)); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const display = value === '' || value == null ? '—' : value;
  return (
    <div className="min-w-0 group" style={{ padding: '2px 0' }}>
      <div className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      <div className="text-sm flex items-center gap-1.5"
           style={{
             color: link ? 'var(--accent-dark)' : 'var(--text-primary, var(--text-main))',
             ...(warn ? { backgroundColor: '#fef3e2', color: '#b06000', borderRadius: 4, padding: '1px 6px', display: 'inline-flex' } : {}),
           }}>
        {icon && <span style={{ color: 'var(--text-tertiary)' }}>{icon}</span>}
        <span className={`${mono ? 'font-mono text-xs' : ''} ${link ? 'cursor-pointer hover:underline' : ''} truncate`} onClick={link ? onClick : undefined}>{display}</span>
        {copyable && value && (
          <button onClick={doCopy} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Widget({ title, action, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between h-9 px-3 cursor-pointer" onClick={() => setOpen(o => !o)}
           style={{ borderBottom: open ? '1px solid var(--border)' : 'none' }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{title}</span>
        <span style={{ color: 'var(--text-muted)' }}>{action || (open ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}</span>
      </div>
      {open && <div className="px-3 py-2">{children}</div>}
    </div>
  );
}

function WRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-xs">
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span className="font-medium text-right" style={{ color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  );
}

function ListItem({ onClick, dot, id, sub, meta }) {
  return (
    <button onClick={onClick} className="w-full flex items-start gap-2 py-2 text-left rounded transition-colors hover:bg-gray-500/5">
      {dot && <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: dot }} />}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[11px]" style={{ color: 'var(--accent-dark)' }}>{id}</div>
        <div className="text-xs truncate" style={{ color: 'var(--text-main)' }}>{sub}</div>
        <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{meta}</div>
      </div>
    </button>
  );
}

function Empty({ text }) {
  return <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{text}</p>;
}
