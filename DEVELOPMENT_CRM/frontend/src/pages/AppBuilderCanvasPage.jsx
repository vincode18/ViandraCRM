/* ─────────────────────────────────────────────────────────────────────────
   App Builder Canvas Page
   Drag-and-drop page layout builder for customizing object layouts
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, Plus, Settings, Save, RotateCcw, Layout, X, ChevronDown, Search, MoreVertical } from 'lucide-react';
import { loadLayout, saveLayout, publishLayout, revertToPublished, getFieldSchema, getDisplayTypes, getAvailableObjects, autoSaveDraft } from '../services/appBuilderService';

const OBJECTS = getAvailableObjects();
const DISPLAY_TYPES = getDisplayTypes();

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeColor = (type) => {
  const colors = {
    Text: 'var(--color-info)',
    Picklist: 'var(--color-warning)',
    Lookup: 'var(--color-success)',
    Number: '#7B1FA2',
    DateTime: '#00695C',
    Date: '#00695C',
    TextArea: 'var(--color-info)',
    MultiPicklist: 'var(--color-warning)',
  };
  return colors[type] || 'var(--text-muted)';
};

const fieldBadge = (type) => (
  <span style={{ backgroundColor: `${typeColor(type)}18`, color: typeColor(type), fontFamily: 'monospace', fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 600, whiteSpace: 'nowrap' }}>
    {type}
  </span>
);

// ─── Field Card ───────────────────────────────────────────────────────────────
function FieldCard({ field, sectionId, onDragStart, onSettings, onToggleVisible }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, { type: 'field', fieldApiName: field.apiName, fromSection: sectionId })}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'grab',
        userSelect: 'none',
        gridColumn: field.span === 2 ? '1 / -1' : 'auto',
        opacity: field.visible ? 1 : 0.45,
        position: 'relative',
      }}
    >
      {field.pinned && (
        <div style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} title="Pinned" />
      )}
      <div style={{ color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }}>⠿</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {field.showLabel ? field.label : <em style={{ color: 'var(--text-muted)' }}>Label hidden</em>}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)' }}>{field.apiName}</div>
      </div>
      {fieldBadge(field.type)}
      <button
        onClick={() => onToggleVisible(sectionId, field.apiName)}
        title={field.visible ? 'Hide field' : 'Show field'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: field.visible ? 'var(--text-tertiary)' : 'var(--text-muted)', fontSize: 14, padding: 2 }}
      >
        {field.visible ? '👁' : '🚫'}
      </button>
      <button
        onClick={() => onSettings(sectionId, field.apiName)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 13, padding: 2 }}
        title="Field properties"
      >
        ⚙
      </button>
    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────
function SectionBlock({ section, onDragStart, onDrop, onDragOver, onFieldSettings, onToggleVisible, onLabelChange, onColsChange, onDisplayTypeChange, onToggleCollapse, onDelete }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelVal, setLabelVal] = useState(section.label);

  const visibleFields = section.fields.filter((f) => f.visible);
  const pinnedFields = visibleFields.filter((f) => f.pinned);
  const normalFields = visibleFields.filter((f) => !f.pinned);
  const orderedFields = [...pinnedFields, ...normalFields];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, { type: 'section', sectionId: section.id })}
      style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
    >
      <div
        onDragOver={(e) => { e.preventDefault(); onDragOver(e, section.id, null); }}
        onDrop={(e) => onDrop(e, section.id, null)}
        style={{ background: 'var(--bg-light)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}
      >
        <span style={{ color: 'var(--text-muted)', cursor: 'grab' }}>⠿</span>
        {editingLabel ? (
          <input
            autoFocus
            value={labelVal}
            onChange={(e) => setLabelVal(e.target.value)}
            onBlur={() => { setEditingLabel(false); onLabelChange(section.id, labelVal); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { setEditingLabel(false); onLabelChange(section.id, labelVal); } }}
            style={{ flex: 1, fontWeight: 600, fontSize: 13, border: '1px solid var(--accent)', borderRadius: 3, padding: '2px 6px', color: 'var(--text-main)', background: 'var(--bg-base)' }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditingLabel(true)}
            style={{ flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--text-main)', cursor: 'text' }}
            title="Double-click to rename"
          >
            {section.label}
          </span>
        )}
        <select
          value={section.displayType}
          onChange={(e) => onDisplayTypeChange(section.id, e.target.value)}
          style={{ fontSize: 11, border: '1px solid var(--border)', borderRadius: 3, padding: '2px 6px', color: 'var(--text-secondary)', background: 'var(--bg-base)', cursor: 'pointer' }}
        >
          {DISPLAY_TYPES.map((dt) => <option key={dt}>{dt}</option>)}
        </select>
        <button
          onClick={() => onColsChange(section.id, section.columns === 1 ? 2 : 1)}
          title={`Switch to ${section.columns === 1 ? '2' : '1'} column`}
          style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          {section.columns === 1 ? '1 col' : '2 col'}
        </button>
        <button onClick={() => onToggleCollapse(section.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 14 }}>
          {section.collapsed ? '▶' : '▼'}
        </button>
        <button onClick={() => onDelete(section.id)} title="Delete section" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: 14 }}>
          ✕
        </button>
      </div>

      {!section.collapsed && (
        <div
          onDragOver={(e) => { e.preventDefault(); onDragOver(e, section.id, null); }}
          onDrop={(e) => onDrop(e, section.id, null)}
          style={{ padding: 12, minHeight: 60 }}
        >
          {section.displayType === 'Metric Tile' ? (
            <MetricTileDisplay fields={orderedFields} />
          ) : section.displayType === 'Activity Timeline' ? (
            <TimelineDisplay fields={orderedFields} />
          ) : section.displayType === 'Compact List' ? (
            <CompactListDisplay fields={orderedFields} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: section.columns === 2 ? '1fr 1fr' : '1fr', gap: 6 }}>
              {orderedFields.length === 0 ? (
                <div style={{ gridColumn: '1/-1', padding: '20px', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: 4, color: 'var(--text-muted)', fontSize: 13 }}>
                  Drag fields here
                </div>
              ) : (
                orderedFields.map((f) => (
                  <FieldCard
                    key={f.apiName}
                    field={f}
                    sectionId={section.id}
                    onDragStart={onDragStart}
                    onSettings={onFieldSettings}
                    onToggleVisible={onToggleVisible}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Display Type Renderers ───────────────────────────────────────────────────
function MetricTileDisplay({ fields }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {fields.slice(0, 4).map((f) => (
        <div key={f.apiName} style={{ flex: '1 1 120px', minWidth: 100, background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: typeColor(f.type) }}>—</div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginTop: 4 }}>{f.label}</div>
        </div>
      ))}
      {fields.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Drag fields here to display as tiles</div>}
    </div>
  );
}

function TimelineDisplay({ fields }) {
  return (
    <div style={{ paddingLeft: 12 }}>
      {fields.slice(0, 5).map((f, i) => (
        <div key={f.apiName} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
            {i < fields.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', minHeight: 16 }} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-main)' }}>{f.label}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>—</div>
          </div>
        </div>
      ))}
      {fields.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Drag fields to build timeline</div>}
    </div>
  );
}

function CompactListDisplay({ fields }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {fields.map((f) => (
        <span key={f.apiName} style={{ fontSize: 12, padding: '3px 10px', background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-secondary)' }}>
          {f.label}: <span style={{ color: 'var(--text-muted)' }}>—</span>
        </span>
      ))}
      {fields.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Drag fields to populate list</span>}
    </div>
  );
}

// ─── Field Properties Panel ───────────────────────────────────────────────────
function FieldPropertiesPanel({ field, sectionId, onClose, onApply }) {
  const [span, setSpan] = useState(field.span);
  const [pinned, setPinned] = useState(field.pinned);
  const [showLabel, setShowLabel] = useState(field.showLabel);
  const [readOnly, setReadOnly] = useState(field.readOnly || false);

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 300, background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', boxShadow: '-4px 0 16px rgba(0,0,0,0.10)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>Field: {field.label}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{field.apiName}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{ marginBottom: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>Field Type</div>
        <div style={{ marginBottom: 16 }}>{fieldBadge(field.type)}</div>

        <div style={{ marginBottom: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>Position</div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Column Span</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpan(s)}
                style={{ flex: 1, padding: '6px 0', borderRadius: 4, border: span === s ? '1px solid var(--accent)' : '1px solid var(--border)', background: span === s ? 'var(--accent-pale)' : 'var(--bg-light)', color: span === s ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: span === s ? 600 : 400, fontSize: 12, cursor: 'pointer' }}
              >
                {s} col
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Pin to Top</label>
          <Toggle value={pinned} onChange={setPinned} />
        </div>

        <div style={{ marginBottom: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>Display</div>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Show Label</label>
          <Toggle value={showLabel} onChange={setShowLabel} />
        </div>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Read Only</label>
          <Toggle value={readOnly} onChange={setReadOnly} />
        </div>
      </div>
      <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: '8px 0', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-light)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>
          Cancel
        </button>
        <button onClick={() => onApply(sectionId, field.apiName, { span, pinned, showLabel, readOnly })} style={{ flex: 1, padding: '8px 0', borderRadius: 4, border: 'none', background: 'var(--accent)', color: 'var(--text-main)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Apply
        </button>
      </div>
    </div>
  );
}

// ─── Canvas Settings Panel ────────────────────────────────────────────────────
function CanvasSettingsPanel({ onClose }) {
  const [gutter, setGutter] = useState('24px');
  const [sectionGap, setSectionGap] = useState('12px');
  const [fontScale, setFontScale] = useState('100%');
  const [density, setDensity] = useState('Standard');
  const [customTypes, setCustomTypes] = useState([
    { id: 'ct-1', name: 'KPI Summary', base: 'Metric Tile' },
  ]);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeBase, setNewTypeBase] = useState('Detail Grid');
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);

  const selectStyle = { fontSize: 12, border: '1px solid var(--border)', borderRadius: 3, padding: '4px 8px', color: 'var(--text-secondary)', background: 'var(--bg-base)', cursor: 'pointer' };
  const inputStyle = { width: '100%', fontSize: 12, border: '1px solid var(--border)', borderRadius: 3, padding: '6px 8px', color: 'var(--text-secondary)', background: 'var(--bg-base)', boxSizing: 'border-box' };
  const ghostBtn = { padding: '7px 0', background: 'var(--bg-light)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)' };
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 };

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', zIndex: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-light)' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)' }}>⚙ Canvas Settings</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18 }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8, marginTop: 4 }}>Global Settings</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Page Gutter</label>
          <select value={gutter} onChange={(e) => setGutter(e.target.value)} style={selectStyle}>
            {['16px','20px','24px','32px'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Section Gap</label>
          <select value={sectionGap} onChange={(e) => setSectionGap(e.target.value)} style={selectStyle}>
            {['8px','12px','16px','20px','24px'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Font Scale</label>
          <select value={fontScale} onChange={(e) => setFontScale(e.target.value)} style={selectStyle}>
            {['90%','100%','110%'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Density</label>
          <select value={density} onChange={(e) => setDensity(e.target.value)} style={selectStyle}>
            {['Compact','Standard','Relaxed'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8, marginTop: 20 }}>Display Types</div>
        <div style={{ marginBottom: 10 }}>
          {DISPLAY_TYPES.map((dt) => (
            <div key={dt} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', marginBottom: 4, background: 'var(--bg-light)', borderRadius: 4, border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{dt}</span>
                <span style={{ fontSize: 10, marginLeft: 6, color: 'var(--text-muted)', fontStyle: 'italic' }}>built-in</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--color-info)', cursor: 'pointer' }}>Preview</span>
            </div>
          ))}
          {customTypes.map((ct) => (
            <div key={ct.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', marginBottom: 4, background: 'var(--accent-pale)', borderRadius: 4, border: '1px solid var(--accent)' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{ct.name}</span>
                <span style={{ fontSize: 10, marginLeft: 6, color: 'var(--accent-dark)', background: 'var(--accent)', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>custom</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--color-info)', cursor: 'pointer' }}>Edit</span>
                <span onClick={() => setCustomTypes(customTypes.filter(c => c.id !== ct.id))} style={{ fontSize: 11, color: 'var(--color-danger)', cursor: 'pointer' }}>Delete</span>
              </div>
            </div>
          ))}
        </div>

        {showNewTypeForm ? (
          <div style={{ background: 'var(--bg-light)', borderRadius: 6, padding: 12, border: '1px solid var(--border)', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>New Display Type</div>
            <label style={labelStyle}>Name</label>
            <input value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} placeholder="e.g. KPI Summary" style={{ ...inputStyle, marginBottom: 8 }} />
            <label style={labelStyle}>Base Template</label>
            <select value={newTypeBase} onChange={(e) => setNewTypeBase(e.target.value)} style={{ ...selectStyle, marginBottom: 10, width: '100%' }}>
              {DISPLAY_TYPES.map(dt => <option key={dt}>{dt}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setShowNewTypeForm(false)} style={{ flex: 1, ...ghostBtn }}>Cancel</button>
              <button
                onClick={() => {
                  if (newTypeName.trim()) {
                    setCustomTypes([...customTypes, { id: `ct-${Date.now()}`, name: newTypeName.trim(), base: newTypeBase }]);
                    setNewTypeName('');
                    setShowNewTypeForm(false);
                  }
                }}
                style={{ flex: 1, padding: '7px 0', background: 'var(--accent)', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--text-main)' }}
              >
                Save Type
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNewTypeForm(true)} style={{ width: '100%', padding: '8px 0', background: 'var(--bg-base)', border: '1px dashed var(--border)', borderRadius: 4, color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer', marginBottom: 8 }}>
            + New Display Type
          </button>
        )}

        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8, marginTop: 16 }}>Field Defaults</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Default Column Span</label>
          <select style={selectStyle}><option>1 col</option><option>2 col</option></select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Show Labels by Default</label>
          <Toggle value={true} onChange={() => {}} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Allow Pinning</label>
          <Toggle value={true} onChange={() => {}} />
        </div>
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, ...ghostBtn }}>Cancel</button>
        <button onClick={onClose} style={{ flex: 1, padding: '9px 0', background: 'var(--accent)', border: 'none', borderRadius: 4, fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--text-main)' }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ─── Toggle Component ─────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 36, height: 20, borderRadius: 10, background: value ? 'var(--accent)' : 'var(--bg-lighter)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: value ? 'var(--text-main)' : 'var(--text-muted)', transition: 'left 0.2s' }} />
    </div>
  );
}

// ─── Field Tray ───────────────────────────────────────────────────────────────
function FieldTray({ object, sections, onDragStart }) {
  const [search, setSearch] = useState('');
  const allOnCanvas = new Set(sections.flatMap((s) => s.fields.map((f) => f.apiName)));
  const schema = getFieldSchema(object);

  const filterFields = (fields) => fields.filter((f) => !allOnCanvas.has(f.apiName) && (f.label.toLowerCase().includes(search.toLowerCase()) || f.apiName.toLowerCase().includes(search.toLowerCase())));

  const available = { standard: filterFields(schema.standard), custom: filterFields(schema.custom) };

  return (
    <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Available Fields</div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fields…"
          style={{ width: '100%', fontSize: 12, border: '1px solid var(--border)', borderRadius: 3, padding: '5px 8px', boxSizing: 'border-box', color: 'var(--text-secondary)', background: 'var(--bg-base)' }}
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {['standard', 'custom'].map((group) =>
          available[group].length > 0 ? (
            <div key={group} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4, paddingLeft: 2 }}>{group}</div>
              {available[group].map((f) => (
                <div
                  key={f.apiName}
                  draggable
                  onDragStart={(e) => onDragStart(e, { type: 'tray-field', field: f })}
                  style={{ marginBottom: 4, padding: '7px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, cursor: 'grab', userSelect: 'none' }}
                >
                  <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-main)' }}>{f.label}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)' }}>{f.apiName}</span>
                    {fieldBadge(f.type)}
                  </div>
                </div>
              ))}
            </div>
          ) : null
        )}
        {available.standard.length === 0 && available.custom.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>All fields are on the canvas</div>
        )}
      </div>
    </div>
  );
}

// ─── Main App Builder Canvas Page ─────────────────────────────────────────────
export default function AppBuilderCanvasPage() {
  const [selectedObject, setSelectedObject] = useState('Case');
  const [layouts, setLayouts] = useState({});
  const [showFieldPanel, setShowFieldPanel] = useState(null);
  const [showCanvasSettings, setShowCanvasSettings] = useState(false);
  const [published, setPublished] = useState(true);
  const [toast, setToast] = useState(null);
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const dragData = useRef(null);

  const sections = layouts[selectedObject] || [];

  useEffect(() => {
    loadInitialLayout();
  }, [selectedObject]);

  const loadInitialLayout = async () => {
    setLoading(true);
    const response = await loadLayout(selectedObject);
    if (response.success) {
      setLayouts(prev => ({ ...prev, [selectedObject]: response.data }));
      setPublished(response.isSaved);
    }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const updateLayout = useCallback((updater) => {
    setLayouts(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      updater(copy[selectedObject]);
      return copy;
    });
    setPublished(false);
  }, [selectedObject]);

  const handleDragStart = (e, data) => {
    dragData.current = data;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, sectionId, fieldIndex) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSectionId, targetFieldIndex) => {
    e.preventDefault();
    const data = dragData.current;
    if (!data) return;

    updateLayout((sections) => {
      if (data.type === 'tray-field') {
        // Add field from tray to section
        const section = sections.find(s => s.id === targetSectionId);
        if (section) {
          section.fields.push({ ...data.field, pinned: false, span: 1, showLabel: true, visible: true });
        }
      } else if (data.type === 'field') {
        // Move field between sections
        const sourceSection = sections.find(s => s.id === data.fromSection);
        const targetSection = sections.find(s => s.id === targetSectionId);
        const fieldIndex = sourceSection.fields.findIndex(f => f.apiName === data.fieldApiName);
        if (fieldIndex > -1 && sourceSection && targetSection) {
          const [field] = sourceSection.fields.splice(fieldIndex, 1);
          targetSection.fields.push(field);
        }
      } else if (data.type === 'section') {
        // Reorder sections
        const sectionIndex = sections.findIndex(s => s.id === data.sectionId);
        const targetIndex = sections.findIndex(s => s.id === targetSectionId);
        if (sectionIndex > -1 && targetIndex > -1) {
          const [section] = sections.splice(sectionIndex, 1);
          sections.splice(targetIndex, 0, section);
        }
      }
    });

    dragData.current = null;
  };

  const handleFieldSettings = (sectionId, fieldApiName) => {
    const section = sections.find(s => s.id === sectionId);
    const field = section?.fields.find(f => f.apiName === fieldApiName);
    if (field) {
      setShowFieldPanel({ sectionId, field });
    }
  };

  const handleApplyFieldSettings = (sectionId, fieldApiName, settings) => {
    updateLayout((sections) => {
      const section = sections.find(s => s.id === sectionId);
      const field = section?.fields.find(f => f.apiName === fieldApiName);
      if (field) {
        Object.assign(field, settings);
      }
    });
    setShowFieldPanel(null);
  };

  const handleToggleVisible = (sectionId, fieldApiName) => {
    updateLayout((sections) => {
      const section = sections.find(s => s.id === sectionId);
      const field = section?.fields.find(f => f.apiName === fieldApiName);
      if (field) {
        field.visible = !field.visible;
      }
    });
  };

  const handleLabelChange = (sectionId, newLabel) => {
    updateLayout((sections) => {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        section.label = newLabel;
      }
    });
  };

  const handleColsChange = (sectionId, cols) => {
    updateLayout((sections) => {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        section.columns = cols;
      }
    });
  };

  const handleDisplayTypeChange = (sectionId, displayType) => {
    updateLayout((sections) => {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        section.displayType = displayType;
      }
    });
  };

  const handleToggleCollapse = (sectionId) => {
    updateLayout((sections) => {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        section.collapsed = !section.collapsed;
      }
    });
  };

  const handleDeleteSection = (sectionId) => {
    updateLayout((sections) => {
      const index = sections.findIndex(s => s.id === sectionId);
      if (index > -1) {
        sections.splice(index, 1);
      }
    });
  };

  const handleAddSection = () => {
    if (!newSectionLabel.trim()) return;
    updateLayout((sections) => {
      sections.push({
        id: `s-${Date.now()}`,
        label: newSectionLabel,
        columns: 2,
        displayType: 'Detail Grid',
        collapsed: false,
        fields: [],
      });
    });
    setNewSectionLabel('');
    setShowNewSection(false);
  };

  const handleSave = async () => {
    const response = await saveLayout(selectedObject, sections);
    if (response.success) {
      setPublished(true);
      showToast('Layout saved successfully');
    } else {
      showToast('Failed to save layout', 'error');
    }
  };

  const handlePublish = async () => {
    const response = await publishLayout(selectedObject, sections);
    if (response.success) {
      setPublished(true);
      showToast('Layout published successfully');
    } else {
      showToast('Failed to publish layout', 'error');
    }
  };

  const handleRevert = async () => {
    const response = await revertToPublished(selectedObject);
    if (response.success) {
      setLayouts(prev => ({ ...prev, [selectedObject]: response.data }));
      setPublished(true);
      showToast('Reverted to published layout');
    } else {
      showToast('Failed to revert layout', 'error');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {showFieldPanel && (
        <FieldPropertiesPanel
          field={showFieldPanel.field}
          sectionId={showFieldPanel.sectionId}
          onClose={() => setShowFieldPanel(null)}
          onApply={handleApplyFieldSettings}
        />
      )}

      {showCanvasSettings && (
        <CanvasSettingsPanel onClose={() => setShowCanvasSettings(false)} />
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeft size={18} className="cursor-pointer" style={{ color: 'var(--text-muted)' }} />
            <h1 className="text-xl font-bold">App Builder Canvas</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedObject}
              onChange={(e) => setSelectedObject(e.target.value)}
              className="input-field text-sm"
            >
              {OBJECTS.map(obj => <option key={obj}>{obj}</option>)}
            </select>
            <button
              onClick={handleRevert}
              disabled={published}
              className="btn-secondary px-3 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw size={14} /> Revert
            </button>
            <button
              onClick={handleSave}
              className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
            >
              <Save size={14} /> Save
            </button>
            <button
              onClick={handlePublish}
              disabled={published}
              className="btn-primary px-3 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Layout size={14} /> Publish
            </button>
            <button
              onClick={() => setShowCanvasSettings(true)}
              className="btn-secondary px-3 py-2"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Field Tray */}
        <FieldTray object={selectedObject} sections={sections} onDragStart={handleDragStart} />

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading layout...</div>
          ) : (
            <>
              {sections.map((section) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onFieldSettings={handleFieldSettings}
                  onToggleVisible={handleToggleVisible}
                  onLabelChange={handleLabelChange}
                  onColsChange={handleColsChange}
                  onDisplayTypeChange={handleDisplayTypeChange}
                  onToggleCollapse={handleToggleCollapse}
                  onDelete={handleDeleteSection}
                />
              ))}

              {showNewSection ? (
                <div className="card p-4" style={{ border: '1px dashed var(--accent)' }}>
                  <input
                    value={newSectionLabel}
                    onChange={(e) => setNewSectionLabel(e.target.value)}
                    placeholder="Section label..."
                    className="input-field text-sm mb-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddSection} className="btn-primary px-4 py-2 text-sm">Add Section</button>
                    <button onClick={() => { setShowNewSection(false); setNewSectionLabel(''); }} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewSection(true)}
                  className="w-full py-3 border-2 border-dashed rounded-lg text-sm flex items-center justify-center gap-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <Plus size={16} /> Add Section
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm" style={{ background: toast.type === 'error' ? '#FFEBEE' : '#E8F5E9', color: toast.type === 'error' ? '#C62828' : '#388E3C', border: `1px solid ${toast.type === 'error' ? '#C62828' : '#388E3C'}` }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
