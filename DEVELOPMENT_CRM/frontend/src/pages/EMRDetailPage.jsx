import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, ChevronDown, ChevronUp, CheckCircle, Activity,
  Upload, Download, Trash2, Share2, User, FileText, Clock,
  Camera, Image as ImageIcon, ExternalLink, Building2, Package
} from 'lucide-react';
import {
  emrById, additionalGroupsByEMR, additionalInfoByEMR, historyByEMR,
  photosByEMR, getStagesForType, getStageState, EMR_STATUS_TOKENS,
  EMILA_CATEGORIES
} from '../utils/emrData';

/* ── Chevron Progress Bar ─────────────────────────────────────────────── */
function ChevronProgressBar({ stages, currentStatus }) {
  return (
    <div className="flex items-stretch" style={{ gap: 0 }}>
      {stages.map((stage, idx) => {
        const state = getStageState(stages, currentStatus, stage);
        const isFirst = idx === 0;
        const isLast = idx === stages.length - 1;
        const bgColor = state === 'completed' ? '#388E3C'
          : state === 'active' ? 'var(--accent)'
          : 'var(--bg-light)';
        const textColor = state === 'active' ? '#1a1a1a'
          : state === 'completed' ? '#fff'
          : 'var(--text-muted)';
        const borderColor = state === 'pending' ? 'var(--border)' : 'transparent';

        return (
          <div key={stage} className="relative flex items-center justify-center"
            style={{
              flex: 1,
              minHeight: 36,
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              clipPath: isLast
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)'
                : isFirst
                  ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                  : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
              marginLeft: idx > 0 ? -1 : 0,
              zIndex: state === 'active' ? 10 : state === 'completed' ? 5 : 1,
            }}>
            <span className="text-[10px] font-bold px-4 text-center leading-tight select-none" style={{ color: textColor }}>
              {state === 'completed' ? <CheckCircle size={12} className="inline mr-0.5" /> : null}
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Status Badge ─────────────────────────────────────────────────────── */
function EMRStatusBadge({ status }) {
  const t = EMR_STATUS_TOKENS[status] || { color: '#6C7681', bg: 'rgba(108,118,129,0.1)', border: '#6C7681' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
      {status}
    </span>
  );
}

/* ── Field Row (inline editable) ─────────────────────────────────────── */
function FieldRow({ label, value, editable = true, mono = false }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');

  return (
    <div className="flex items-start py-2.5 group" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="w-52 text-xs shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {editing ? (
        <div className="flex items-center gap-1.5 flex-1">
          <input
            autoFocus
            value={val}
            onChange={e => setVal(e.target.value)}
            className="flex-1 text-sm rounded px-2 py-1"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--accent)', color: 'var(--text-main)' }}
          />
          <button onClick={() => setEditing(false)} className="text-green-500 hover:text-green-400 text-xs font-bold">✓</button>
          <button onClick={() => { setVal(value ?? ''); setEditing(false); }} className="text-red-400 hover:text-red-300 text-xs font-bold">✕</button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <span className={`text-sm flex-1 ${mono ? 'font-mono' : ''}`} style={{ color: val ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
            {val || '—'}
          </span>
          {editable && (
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-500/10"
              style={{ color: 'var(--text-muted)' }}>
              <Edit size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Collapsible Section ─────────────────────────────────────────────── */
function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-gray-500/5"
        style={{ color: 'var(--text-main)', borderBottom: open ? '1px solid var(--border)' : 'none' }}>
        {title}
        {open ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && <div className="px-5 pb-4 pt-1">{children}</div>}
    </div>
  );
}

/* ── Related List Card ───────────────────────────────────────────────── */
function RelatedListCard({ title, icon: Icon, count, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg overflow-hidden mb-3" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-gray-500/5"
        style={{ color: 'var(--text-muted)', borderBottom: open ? '1px solid var(--border)' : 'none' }}>
        <span className="flex items-center gap-2">
          <Icon size={13} /> {title}
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)' }}>{count}</span>
        </span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
}

/* ── EMILA Photo Input ───────────────────────────────────────────────── */
function EMILAPhotoInput({ emrId }) {
  const [activeCategory, setActiveCategory] = useState('E');
  const photos = photosByEMR(emrId, activeCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {EMILA_CATEGORIES.map(cat => (
          <button key={cat.code}
            onClick={() => setActiveCategory(cat.code)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: activeCategory === cat.code ? 'var(--accent)' : 'var(--bg-base)',
              color: activeCategory === cat.code ? '#1a1a1a' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}>
            {cat.code} — {cat.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {photos.map(p => (
          <div key={p.id} className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)' }}>
            <div className="h-20 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
              <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="p-2">
              <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
              <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Order #{p.orderNumber} · {p.groupType}</p>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-2 text-center py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            No photos for {EMILA_CATEGORIES.find(c => c.code === activeCategory)?.label} category
          </div>
        )}
      </div>

      {/* Upload Drop Zone */}
      <div className="rounded-lg border-2 border-dashed p-4 text-center transition-colors"
        style={{ borderColor: 'var(--border)', cursor: 'pointer' }}>
        <Camera size={20} className="mx-auto mb-1" style={{ color: 'var(--text-muted)' }} />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Drop photo here or <span style={{ color: 'var(--accent)' }}>browse</span></p>
      </div>
    </div>
  );
}

/* ── Main EMR Detail Page ─────────────────────────────────────────────── */
export default function EMRDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  const emr = emrById(decodeURIComponent(id));
  const additionalGroups = emr ? additionalGroupsByEMR(emr.id) : [];
  const additionalInfo = emr ? additionalInfoByEMR(emr.id) : [];
  const history = emr ? historyByEMR(emr.id) : [];

  if (!emr) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="text-center">
          <Activity size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>EMR not found: {id}</p>
          <button onClick={() => navigate('/emr')} className="mt-4 text-xs px-3 py-1.5 rounded"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>← Back to EMR List</button>
        </div>
      </div>
    );
  }

  const stages = getStagesForType(emr.type);
  const tabs = emr.type === 'U'
    ? ['Details', 'Feed', 'FAR', 'TSI', 'TSR']
    : ['Details', 'Feed'];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <div className="px-6 py-2 flex items-center gap-2 text-xs" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <button onClick={() => navigate('/emr')} className="hover:underline" style={{ color: 'var(--text-muted)' }}>EMR</button>
        <span style={{ color: 'var(--text-muted)' }}>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>{emr.id}</span>
      </div>

      {/* ── Action Bar ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-6 py-2.5 flex-wrap" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('/emr')} className="p-1.5 rounded transition-colors mr-1"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} />
        </button>
        {emr.type === 'S' && (
          <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5 font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
            + Follow
          </button>
        )}
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Upload size={13} /> Upload Techcare Files
        </button>
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Download size={13} /> Get Image From Azure
        </button>
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Share2 size={13} /> Sharing
        </button>
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <User size={13} /> Change Owner
        </button>
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Edit size={13} /> Edit
        </button>
        <button className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5 ml-auto"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: '#C62828' }}>
          <Trash2 size={13} /> Delete
        </button>
      </div>

      {/* ── Subject Banner ──────────────────────────────────── */}
      <div className="px-6 py-4" style={{ backgroundColor: 'var(--accent)' }}>
        <div className="flex items-start gap-3">
          <Activity size={20} style={{ color: '#1a1a1a', marginTop: 2 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span className="font-mono text-sm font-bold" style={{ color: '#1a1a1a' }}>{emr.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ backgroundColor: 'rgba(26,26,26,0.15)', color: '#1a1a1a' }}>
                {emr.type === 'U' ? 'U-type (Unscheduled)' : 'S-type (Scheduled)'}
              </span>
            </div>
            <p className="text-base font-semibold leading-snug" style={{ color: '#1a1a1a' }}>{emr.subject}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs flex-wrap" style={{ color: '#3a3a3a' }}>
              <span>WO: {emr.workOrder}</span>
              <span>·</span>
              <span>Account: {emr.account}</span>
              <span>·</span>
              <span>Asset: {emr.asset}</span>
            </div>
          </div>
          <EMRStatusBadge status={emr.status} />
        </div>
      </div>

      {/* ── Chevron Progress Bar ─────────────────────────────── */}
      <div className="px-6 py-3" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        <ChevronProgressBar stages={stages} currentStatus={emr.status} />
      </div>

      {/* ── Tab Bar ─────────────────────────────────────────── */}
      <div className="px-6 flex gap-5" style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.toLowerCase() ? 'border-brand-blue' : 'border-transparent'}`}
            style={{ color: activeTab === tab.toLowerCase() ? 'var(--text-main)' : 'var(--text-muted)' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Two-Panel Body ──────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex">

        {/* Main Content (65%) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxWidth: '65%' }}>
          {activeTab === 'details' && (
            <>
              {/* Core Fields */}
              <CollapsibleSection title="Core Fields">
                <div className="grid grid-cols-2 gap-x-8 mt-2">
                  <div>
                    <FieldRow label="EMR Name" value={emr.id} editable={false} mono />
                    <FieldRow label="EMR Status" value={emr.status} />
                    <FieldRow label="Owner" value={emr.owner} />
                    <FieldRow label="Flag Azure" value={emr.flagAzure ? 'Yes' : 'No'} />
                  </div>
                  <div>
                    <FieldRow label="UT Assign TO" value={emr.utAssignTO} />
                    <FieldRow label="UT Submit" value={emr.utSubmit ? new Date(emr.utSubmit).toLocaleString('en-GB') : ''} />
                    <FieldRow label="Aging Day" value={emr.agingDay ? `${emr.agingDay} days` : ''} mono />
                    <FieldRow label="Hours on Component" value={emr.hoursOnComponent ? `${emr.hoursOnComponent} H` : ''} mono />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Customer Information */}
              <CollapsibleSection title="Customer Information">
                <div className="grid grid-cols-2 gap-x-8 mt-2">
                  <div>
                    <FieldRow label="Machine Model" value={emr.machineModel} />
                    <FieldRow label="Machine Product" value={emr.machineProduct} />
                    <FieldRow label="Serial Number" value={emr.serialNumber} mono />
                    <FieldRow label="Machine Code" value={emr.machineCode} />
                    <FieldRow label="Engine Model" value={emr.engineModel} />
                    <FieldRow label="Engine Number" value={emr.engineNumber} mono />
                  </div>
                  <div>
                    <FieldRow label="Branch / Site" value={emr.branchSite} />
                    <FieldRow label="Service Area" value={emr.serviceArea} />
                    <FieldRow label="Delivery Date" value={emr.deliveryDate} />
                    <FieldRow label="Account" value={emr.account} />
                    <FieldRow label="Warranty Remarks" value={emr.warrantyRemarks} />
                    <FieldRow label="Machine Group" value={emr.machineGroup} />
                  </div>
                </div>
              </CollapsibleSection>

              {/* EMR Information */}
              <CollapsibleSection title="EMR Information">
                <div className="grid grid-cols-2 gap-x-8 mt-2">
                  <div>
                    <FieldRow label="EMR Plant" value={emr.emrPlant} />
                    <FieldRow label="Work Order" value={emr.workOrder} />
                    <FieldRow label="Case" value={emr.case} />
                    <FieldRow label="PMact Type" value={emr.pmactType} />
                    <FieldRow label="WO SAP No" value={emr.woSAPNo} mono />
                    <FieldRow label="Sub Call Type" value={emr.subCallType} />
                    <FieldRow label="Trouble Date" value={emr.troubleDate ? new Date(emr.troubleDate).toLocaleString('en-GB') : ''} />
                  </div>
                  <div>
                    <FieldRow label="Start B/D Datetime" value={emr.startBDDatetime ? new Date(emr.startBDDatetime).toLocaleString('en-GB') : ''} />
                    <FieldRow label="Finish B/D Datetime" value={emr.finishBDDatetime ? new Date(emr.finishBDDatetime).toLocaleString('en-GB') : ''} />
                    <FieldRow label="SMR Trouble" value={emr.smrTrouble ? `${emr.smrTrouble} H` : ''} mono />
                    <FieldRow label="SMR RFU" value={emr.smrRFU ? `${emr.smrRFU} H` : ''} mono />
                    <FieldRow label="Lead Time (Hours)" value={emr.leadTimeHours ? `${emr.leadTimeHours} H` : ''} mono />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Other Information */}
              <CollapsibleSection title="Other Information" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-x-8 mt-2">
                  <div>
                    <FieldRow label="Unit Location" value={emr.unitLocation} />
                    <FieldRow label="Shift" value={emr.shift ? `Shift ${emr.shift}` : ''} />
                    <FieldRow label="Informasi" value={emr.informasi} />
                    <FieldRow label="Sub Informasi" value={emr.subInformasi} />
                    <FieldRow label="Problem Status" value={emr.problemStatus} />
                    <FieldRow label="Machine Status" value={emr.machineStatus} />
                  </div>
                  <div>
                    <FieldRow label="Application" value={emr.application} />
                    <FieldRow label="Manufacture" value={emr.manufacture} />
                    <FieldRow label="Responsibility" value={emr.responsibility} />
                    <FieldRow label="Submit to Claim" value={emr.submitToClaim ? 'Yes' : 'No'} />
                    <FieldRow label="Need Support HO" value={emr.needSupportHO ? 'Yes' : 'No'} />
                    <FieldRow label="Resto" value={emr.resto} />
                    <FieldRow label="Resto Man Power" value={emr.restoManPower} />
                  </div>
                </div>
              </CollapsibleSection>

              {/* EMILA Photo Input */}
              <CollapsibleSection title="EMILA Photos">
                <EMILAPhotoInput emrId={emr.id} />
              </CollapsibleSection>

              {/* System Information */}
              <CollapsibleSection title="System Information" defaultOpen={false}>
                <FieldRow label="Created By" value={emr.createdBy} />
                <FieldRow label="Created At" value={new Date(emr.createdAt).toLocaleString('en-GB')} editable={false} />
                <FieldRow label="Last Modified By" value={emr.lastModifiedBy} />
                <FieldRow label="Last Modified At" value={new Date(emr.lastModifiedAt).toLocaleString('en-GB')} editable={false} />
              </CollapsibleSection>
            </>
          )}

          {activeTab === 'feed' && (
            <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Clock size={28} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Activity feed for this EMR will appear here.</p>
            </div>
          )}

          {['far', 'tsi', 'tsr'].includes(activeTab) && (
            <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <FileText size={28} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{activeTab.toUpperCase()} Tab</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Content for {activeTab.toUpperCase()} will be rendered here.</p>
            </div>
          )}
        </div>

        {/* Related Panel (35%) */}
        <div className="w-[35%] shrink-0 overflow-y-auto p-4" style={{ borderLeft: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>

          {/* Work Orders */}
          <RelatedListCard title="Work Orders" icon={FileText} count={1}>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
              <button onClick={() => navigate(`/workorders/${encodeURIComponent(emr.workOrder)}`)}
                className="text-xs font-semibold hover:underline flex items-center gap-1"
                style={{ color: 'var(--accent)' }}>
                <ExternalLink size={11} /> {emr.workOrder}
              </button>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>SAP No: {emr.woSAPNo}</p>
            </div>
          </RelatedListCard>

          {/* EMR Additional Group */}
          <RelatedListCard title="EMR Additional Group" icon={Package} count={additionalGroups.length}>
            {additionalGroups.length === 0 ? (
              <p className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>No groups</p>
            ) : (
              <div className="space-y-1.5">
                {additionalGroups.slice(0, 6).map(g => (
                  <div key={g.id} className="flex items-center justify-between px-2 py-1.5 rounded"
                    style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                    <span className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{g.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 ml-2"
                      style={{
                        backgroundColor: g.groupType === 'FSL' ? 'rgba(245,200,0,0.1)' : 'rgba(74,144,226,0.1)',
                        color: g.groupType === 'FSL' ? '#8B7500' : '#1565C0',
                      }}>
                      {g.groupType}
                    </span>
                  </div>
                ))}
                {additionalGroups.length > 6 && (
                  <button className="text-xs font-medium mt-1" style={{ color: 'var(--accent)' }}>
                    View All ({additionalGroups.length}) →
                  </button>
                )}
              </div>
            )}
          </RelatedListCard>

          {/* EMR Additional Information */}
          <RelatedListCard title="EMR Additional Information" icon={FileText} count={additionalInfo.length}>
            {additionalInfo.length === 0 ? (
              <p className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>No additional information</p>
            ) : (
              <div className="space-y-1.5">
                {additionalInfo.map(ai => (
                  <div key={ai.id} className="px-2 py-1.5 rounded" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{ai.description}</p>
                    <a href={ai.url} className="text-[10px]" style={{ color: 'var(--accent)' }}>View →</a>
                  </div>
                ))}
              </div>
            )}
          </RelatedListCard>

          {/* EMR History */}
          <RelatedListCard title="EMR History" icon={Clock} count={history.length}>
            {history.length === 0 ? (
              <p className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>No history</p>
            ) : (
              <div className="space-y-2">
                {history.map(h => (
                  <div key={h.id} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                      style={{ backgroundColor: 'rgba(74,144,226,0.15)', color: '#4A90E2', fontSize: 8 }}>●</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{h.field}</span>
                        <span className="text-[10px] line-through" style={{ color: '#C62828' }}>{h.oldValue || '—'}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>→</span>
                        <span className="text-[10px] font-semibold" style={{ color: '#388E3C' }}>{h.newValue}</span>
                      </div>
                      <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{h.timestamp} · {h.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </RelatedListCard>
        </div>
      </div>
    </div>
  );
}

