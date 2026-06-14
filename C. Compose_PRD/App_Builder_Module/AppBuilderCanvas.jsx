import { useState, useRef, useCallback } from "react";

// ─── Design System Tokens (inline for portability) ───────────────────────────
const DS = {
  accent: "#F5C800",
  accentDark: "#E0B200",
  accentLight: "#FFC800",
  accentPale: "#FFFDE7",
  bgBase: "#FFFFFF",
  bgPanel: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgLight: "#F5F5F5",
  bgLighter: "#EFEFEF",
  border: "#E0E0E0",
  textMain: "#1A1A1A",
  textSecondary: "#2C2C2C",
  textTertiary: "#757575",
  textMuted: "#BDBDBD",
  danger: "#C62828",
  warning: "#F57C00",
  success: "#388E3C",
  info: "#1976D2",
};

// ─── Initial Data ─────────────────────────────────────────────────────────────
const OBJECTS = ["Case", "Work Order", "Service Appointment"];

const FIELD_SCHEMA = {
  Case: {
    standard: [
      { apiName: "CaseNumber", label: "Case Number", type: "Text" },
      { apiName: "Subject", label: "Subject", type: "Text" },
      { apiName: "Status", label: "Status", type: "Picklist" },
      { apiName: "Priority", label: "Priority", type: "Picklist" },
      { apiName: "Origin", label: "Case Origin", type: "Picklist" },
      { apiName: "Description", label: "Description", type: "TextArea" },
      { apiName: "AccountId", label: "Account Name", type: "Lookup" },
      { apiName: "ContactId", label: "Contact Name", type: "Lookup" },
      { apiName: "OwnerId", label: "Case Owner", type: "Lookup" },
      { apiName: "CreatedDate", label: "Created Date", type: "DateTime" },
    ],
    custom: [
      { apiName: "SLA_Hours__c", label: "SLA Hours Remaining", type: "Number" },
      { apiName: "Escalation_Reason__c", label: "Escalation Reason", type: "Text" },
      { apiName: "Resolution_Code__c", label: "Resolution Code", type: "Picklist" },
    ],
  },
  "Work Order": {
    standard: [
      { apiName: "WorkOrderNumber", label: "Work Order Number", type: "Text" },
      { apiName: "Status", label: "Status", type: "Picklist" },
      { apiName: "Subject", label: "Subject", type: "Text" },
      { apiName: "StartDate", label: "Start Date", type: "Date" },
      { apiName: "EndDate", label: "End Date", type: "Date" },
      { apiName: "AccountId", label: "Account", type: "Lookup" },
      { apiName: "Duration", label: "Duration", type: "Number" },
    ],
    custom: [
      { apiName: "Tech_Skills__c", label: "Required Skills", type: "MultiPicklist" },
      { apiName: "Equipment_Used__c", label: "Equipment Used", type: "Text" },
    ],
  },
  "Service Appointment": {
    standard: [
      { apiName: "AppointmentNumber", label: "Appointment Number", type: "Text" },
      { apiName: "Status", label: "Status", type: "Picklist" },
      { apiName: "SchedStartTime", label: "Scheduled Start", type: "DateTime" },
      { apiName: "SchedEndTime", label: "Scheduled End", type: "DateTime" },
      { apiName: "ActualStartTime", label: "Actual Start", type: "DateTime" },
      { apiName: "Subject", label: "Subject", type: "Text" },
    ],
    custom: [
      { apiName: "Travel_Time__c", label: "Travel Time (min)", type: "Number" },
      { apiName: "Customer_Rating__c", label: "Customer Rating", type: "Number" },
    ],
  },
};

const DISPLAY_TYPES = ["Detail Grid", "Metric Tile", "Activity Timeline", "Compact List"];

const makeSection = (label, fields = [], cols = 2) => ({
  id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  label,
  columns: cols,
  displayType: "Detail Grid",
  collapsed: false,
  fields: fields.map((f) => ({ ...f, pinned: false, span: 1, showLabel: true, visible: true })),
});

const DEFAULT_LAYOUTS = {
  Case: [
    makeSection("Case Information", [
      { apiName: "CaseNumber", label: "Case Number", type: "Text" },
      { apiName: "Subject", label: "Subject", type: "Text" },
      { apiName: "Status", label: "Status", type: "Picklist" },
      { apiName: "Priority", label: "Priority", type: "Picklist" },
    ]),
    makeSection("Customer Details", [
      { apiName: "AccountId", label: "Account Name", type: "Lookup" },
      { apiName: "ContactId", label: "Contact Name", type: "Lookup" },
      { apiName: "OwnerId", label: "Case Owner", type: "Lookup" },
    ]),
    makeSection("Additional Info", [
      { apiName: "Description", label: "Description", type: "TextArea" },
      { apiName: "Origin", label: "Case Origin", type: "Picklist" },
    ]),
  ],
  "Work Order": [
    makeSection("Work Order Details", [
      { apiName: "WorkOrderNumber", label: "Work Order Number", type: "Text" },
      { apiName: "Status", label: "Status", type: "Picklist" },
      { apiName: "Subject", label: "Subject", type: "Text" },
    ]),
    makeSection("Schedule", [
      { apiName: "StartDate", label: "Start Date", type: "Date" },
      { apiName: "EndDate", label: "End Date", type: "Date" },
      { apiName: "Duration", label: "Duration", type: "Number" },
    ]),
  ],
  "Service Appointment": [
    makeSection("Appointment Info", [
      { apiName: "AppointmentNumber", label: "Appointment Number", type: "Text" },
      { apiName: "Status", label: "Status", type: "Picklist" },
      { apiName: "Subject", label: "Subject", type: "Text" },
    ]),
    makeSection("Schedule", [
      { apiName: "SchedStartTime", label: "Scheduled Start", type: "DateTime" },
      { apiName: "SchedEndTime", label: "Scheduled End", type: "DateTime" },
    ]),
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeColor = (t) => {
  const m = { Text: DS.info, Picklist: DS.warning, Lookup: DS.success, Number: "#7B1FA2", DateTime: "#00695C", Date: "#00695C", TextArea: DS.info, MultiPicklist: DS.warning };
  return m[t] || DS.textMuted;
};

const fieldBadge = (type) => (
  <span style={{ backgroundColor: `${typeColor(type)}18`, color: typeColor(type), fontFamily: "monospace", fontSize: 10, padding: "2px 6px", borderRadius: 3, fontWeight: 600, whiteSpace: "nowrap" }}>
    {type}
  </span>
);

// ─── Field Card ───────────────────────────────────────────────────────────────
function FieldCard({ field, sectionId, onDragStart, onSettings, onToggleVisible }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, { type: "field", fieldApiName: field.apiName, fromSection: sectionId })}
      style={{
        background: DS.bgCard,
        border: `1px solid ${DS.border}`,
        borderRadius: 4,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "grab",
        userSelect: "none",
        gridColumn: field.span === 2 ? "1 / -1" : "auto",
        opacity: field.visible ? 1 : 0.45,
        position: "relative",
      }}
    >
      {/* Pinned indicator */}
      {field.pinned && (
        <div style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, borderRadius: "50%", background: DS.accent }} title="Pinned" />
      )}
      {/* Drag handle */}
      <div style={{ color: DS.textMuted, fontSize: 14, flexShrink: 0 }}>⠿</div>
      {/* Field info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: DS.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {field.showLabel ? field.label : <em style={{ color: DS.textMuted }}>Label hidden</em>}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: DS.textMuted }}>{field.apiName}</div>
      </div>
      {fieldBadge(field.type)}
      {/* Visibility toggle */}
      <button
        onClick={() => onToggleVisible(sectionId, field.apiName)}
        title={field.visible ? "Hide field" : "Show field"}
        style={{ background: "none", border: "none", cursor: "pointer", color: field.visible ? DS.textTertiary : DS.textMuted, fontSize: 14, padding: 2 }}
      >
        {field.visible ? "👁" : "🚫"}
      </button>
      {/* Settings */}
      <button
        onClick={() => onSettings(sectionId, field.apiName)}
        style={{ background: "none", border: "none", cursor: "pointer", color: DS.textTertiary, fontSize: 13, padding: 2 }}
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
      onDragStart={(e) => onDragStart(e, { type: "section", sectionId: section.id })}
      style={{ marginBottom: 12, borderRadius: 6, overflow: "hidden", border: `1px solid ${DS.border}`, background: DS.bgCard, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
    >
      {/* Section Header */}
      <div
        onDragOver={(e) => { e.preventDefault(); onDragOver(e, section.id, null); }}
        onDrop={(e) => onDrop(e, section.id, null)}
        style={{ background: DS.bgLight, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${DS.border}` }}
      >
        <span style={{ color: DS.textMuted, cursor: "grab" }}>⠿</span>
        {editingLabel ? (
          <input
            autoFocus
            value={labelVal}
            onChange={(e) => setLabelVal(e.target.value)}
            onBlur={() => { setEditingLabel(false); onLabelChange(section.id, labelVal); }}
            onKeyDown={(e) => { if (e.key === "Enter") { setEditingLabel(false); onLabelChange(section.id, labelVal); } }}
            style={{ flex: 1, fontWeight: 600, fontSize: 13, border: `1px solid ${DS.accent}`, borderRadius: 3, padding: "2px 6px", color: DS.textMain, background: DS.bgBase }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditingLabel(true)}
            style={{ flex: 1, fontWeight: 600, fontSize: 13, color: DS.textMain, cursor: "text" }}
            title="Double-click to rename"
          >
            {section.label}
          </span>
        )}
        {/* Display type selector */}
        <select
          value={section.displayType}
          onChange={(e) => onDisplayTypeChange(section.id, e.target.value)}
          style={{ fontSize: 11, border: `1px solid ${DS.border}`, borderRadius: 3, padding: "2px 6px", color: DS.textSecondary, background: DS.bgBase, cursor: "pointer" }}
        >
          {DISPLAY_TYPES.map((dt) => <option key={dt}>{dt}</option>)}
        </select>
        {/* Column toggle */}
        <button
          onClick={() => onColsChange(section.id, section.columns === 1 ? 2 : 1)}
          title={`Switch to ${section.columns === 1 ? "2" : "1"} column`}
          style={{ fontSize: 11, padding: "2px 8px", borderRadius: 3, border: `1px solid ${DS.border}`, background: DS.bgBase, color: DS.textSecondary, cursor: "pointer" }}
        >
          {section.columns === 1 ? "1 col" : "2 col"}
        </button>
        <button onClick={() => onToggleCollapse(section.id)} style={{ background: "none", border: "none", cursor: "pointer", color: DS.textTertiary, fontSize: 14 }}>
          {section.collapsed ? "▶" : "▼"}
        </button>
        <button onClick={() => onDelete(section.id)} title="Delete section" style={{ background: "none", border: "none", cursor: "pointer", color: DS.danger, fontSize: 14 }}>
          ✕
        </button>
      </div>

      {/* Section Body */}
      {!section.collapsed && (
        <div
          onDragOver={(e) => { e.preventDefault(); onDragOver(e, section.id, null); }}
          onDrop={(e) => onDrop(e, section.id, null)}
          style={{ padding: 12, minHeight: 60 }}
        >
          {section.displayType === "Metric Tile" ? (
            <MetricTileDisplay fields={orderedFields} />
          ) : section.displayType === "Activity Timeline" ? (
            <TimelineDisplay fields={orderedFields} />
          ) : section.displayType === "Compact List" ? (
            <CompactListDisplay fields={orderedFields} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: section.columns === 2 ? "1fr 1fr" : "1fr", gap: 6 }}>
              {orderedFields.length === 0 ? (
                <div style={{ gridColumn: "1/-1", padding: "20px", textAlign: "center", border: `2px dashed ${DS.border}`, borderRadius: 4, color: DS.textMuted, fontSize: 13 }}>
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
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {fields.slice(0, 4).map((f) => (
        <div key={f.apiName} style={{ flex: "1 1 120px", minWidth: 100, background: DS.bgLight, border: `1px solid ${DS.border}`, borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: typeColor(f.type) }}>—</div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: DS.textMuted, marginTop: 4 }}>{f.label}</div>
        </div>
      ))}
      {fields.length === 0 && <div style={{ color: DS.textMuted, fontSize: 13 }}>Drag fields here to display as tiles</div>}
    </div>
  );
}

function TimelineDisplay({ fields }) {
  return (
    <div style={{ paddingLeft: 12 }}>
      {fields.slice(0, 5).map((f, i) => (
        <div key={f.apiName} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: DS.accent, flexShrink: 0, marginTop: 4 }} />
            {i < fields.length - 1 && <div style={{ width: 1, flex: 1, background: DS.border, minHeight: 16 }} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: DS.textMain }}>{f.label}</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: DS.textMuted }}>—</div>
          </div>
        </div>
      ))}
      {fields.length === 0 && <div style={{ color: DS.textMuted, fontSize: 13 }}>Drag fields to build timeline</div>}
    </div>
  );
}

function CompactListDisplay({ fields }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {fields.map((f) => (
        <span key={f.apiName} style={{ fontSize: 12, padding: "3px 10px", background: DS.bgLight, border: `1px solid ${DS.border}`, borderRadius: 12, color: DS.textSecondary }}>
          {f.label}: <span style={{ color: DS.textMuted }}>—</span>
        </span>
      ))}
      {fields.length === 0 && <span style={{ color: DS.textMuted, fontSize: 13 }}>Drag fields to populate list</span>}
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
    <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 300, background: DS.bgCard, borderLeft: `1px solid ${DS.border}`, boxShadow: "-4px 0 16px rgba(0,0,0,0.10)", zIndex: 200, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${DS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: DS.textMain }}>Field: {field.label}</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: DS.textMuted }}>{field.apiName}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: DS.textMuted, fontSize: 18 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ marginBottom: 6, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: DS.textMuted, fontWeight: 700 }}>Field Type</div>
        <div style={{ marginBottom: 16 }}>{fieldBadge(field.type)}</div>

        <div style={{ marginBottom: 6, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: DS.textMuted, fontWeight: 700 }}>Position</div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary, display: "block", marginBottom: 4 }}>Column Span</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpan(s)}
                style={{ flex: 1, padding: "6px 0", borderRadius: 4, border: `1px solid ${span === s ? DS.accent : DS.border}`, background: span === s ? DS.accentPale : DS.bgLight, color: span === s ? DS.textMain : DS.textSecondary, fontWeight: span === s ? 600 : 400, fontSize: 12, cursor: "pointer" }}
              >
                {s} col
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary }}>Pin to Top</label>
          <Toggle value={pinned} onChange={setPinned} />
        </div>

        <div style={{ marginBottom: 6, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: DS.textMuted, fontWeight: 700 }}>Display</div>
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary }}>Show Label</label>
          <Toggle value={showLabel} onChange={setShowLabel} />
        </div>
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary }}>Read Only</label>
          <Toggle value={readOnly} onChange={setReadOnly} />
        </div>
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${DS.border}`, display: "flex", gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "8px 0", borderRadius: 4, border: `1px solid ${DS.border}`, background: DS.bgLight, color: DS.textSecondary, fontWeight: 500, fontSize: 13, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={() => onApply(sectionId, field.apiName, { span, pinned, showLabel, readOnly })} style={{ flex: 1, padding: "8px 0", borderRadius: 4, border: "none", background: DS.accent, color: DS.textMain, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Apply
        </button>
      </div>
    </div>
  );
}

// ─── Canvas Settings Panel ────────────────────────────────────────────────────
function CanvasSettingsPanel({ onClose }) {
  const [gutter, setGutter] = useState("24px");
  const [sectionGap, setSectionGap] = useState("12px");
  const [fontScale, setFontScale] = useState("100%");
  const [density, setDensity] = useState("Standard");
  const [customTypes, setCustomTypes] = useState([
    { id: "ct-1", name: "KPI Summary", base: "Metric Tile" },
  ]);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeBase, setNewTypeBase] = useState("Detail Grid");
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);

  return (
    <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 360, background: DS.bgCard, borderLeft: `1px solid ${DS.border}`, boxShadow: "-4px 0 20px rgba(0,0,0,0.12)", zIndex: 300, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${DS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: DS.bgLight }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: DS.textMain }}>⚙ Canvas Settings</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: DS.textMuted, fontSize: 18 }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Global Settings */}
        <SectionHeader>Global Settings</SectionHeader>
        <SettingRow label="Page Gutter">
          <select value={gutter} onChange={(e) => setGutter(e.target.value)} style={selectStyle}>
            {["16px","20px","24px","32px"].map(v => <option key={v}>{v}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Section Gap">
          <select value={sectionGap} onChange={(e) => setSectionGap(e.target.value)} style={selectStyle}>
            {["8px","12px","16px","20px","24px"].map(v => <option key={v}>{v}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Font Scale">
          <select value={fontScale} onChange={(e) => setFontScale(e.target.value)} style={selectStyle}>
            {["90%","100%","110%"].map(v => <option key={v}>{v}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Density">
          <select value={density} onChange={(e) => setDensity(e.target.value)} style={selectStyle}>
            {["Compact","Standard","Relaxed"].map(v => <option key={v}>{v}</option>)}
          </select>
        </SettingRow>

        {/* Display Types */}
        <SectionHeader style={{ marginTop: 20 }}>Display Types</SectionHeader>
        <div style={{ marginBottom: 10 }}>
          {DISPLAY_TYPES.map((dt) => (
            <div key={dt} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", marginBottom: 4, background: DS.bgLight, borderRadius: 4, border: `1px solid ${DS.border}` }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: DS.textMain }}>{dt}</span>
                <span style={{ fontSize: 10, marginLeft: 6, color: DS.textMuted, fontStyle: "italic" }}>built-in</span>
              </div>
              <span style={{ fontSize: 11, color: DS.info, cursor: "pointer" }}>Preview</span>
            </div>
          ))}
          {customTypes.map((ct) => (
            <div key={ct.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", marginBottom: 4, background: DS.accentPale, borderRadius: 4, border: `1px solid ${DS.accent}` }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: DS.textMain }}>{ct.name}</span>
                <span style={{ fontSize: 10, marginLeft: 6, color: DS.accentDark, background: DS.accent, padding: "1px 5px", borderRadius: 3, fontWeight: 600 }}>custom</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, color: DS.info, cursor: "pointer" }}>Edit</span>
                <span onClick={() => setCustomTypes(customTypes.filter(c => c.id !== ct.id))} style={{ fontSize: 11, color: DS.danger, cursor: "pointer" }}>Delete</span>
              </div>
            </div>
          ))}
        </div>

        {showNewTypeForm ? (
          <div style={{ background: DS.bgLight, borderRadius: 6, padding: 12, border: `1px solid ${DS.border}`, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: DS.textMain }}>New Display Type</div>
            <label style={labelStyle}>Name</label>
            <input value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} placeholder="e.g. KPI Summary" style={{ ...inputStyle, marginBottom: 8 }} />
            <label style={labelStyle}>Base Template</label>
            <select value={newTypeBase} onChange={(e) => setNewTypeBase(e.target.value)} style={{ ...selectStyle, marginBottom: 10, width: "100%" }}>
              {DISPLAY_TYPES.map(dt => <option key={dt}>{dt}</option>)}
            </select>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setShowNewTypeForm(false)} style={{ flex: 1, ...ghostBtn }}>Cancel</button>
              <button
                onClick={() => {
                  if (newTypeName.trim()) {
                    setCustomTypes([...customTypes, { id: `ct-${Date.now()}`, name: newTypeName.trim(), base: newTypeBase }]);
                    setNewTypeName("");
                    setShowNewTypeForm(false);
                  }
                }}
                style={{ flex: 1, padding: "7px 0", background: DS.accent, border: "none", borderRadius: 4, fontWeight: 600, fontSize: 12, cursor: "pointer", color: DS.textMain }}
              >
                Save Type
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNewTypeForm(true)} style={{ width: "100%", padding: "8px 0", background: DS.bgBase, border: `1px dashed ${DS.border}`, borderRadius: 4, color: DS.textTertiary, fontSize: 12, cursor: "pointer", marginBottom: 8 }}>
            + New Display Type
          </button>
        )}

        {/* Field Defaults */}
        <SectionHeader style={{ marginTop: 16 }}>Field Defaults</SectionHeader>
        <SettingRow label="Default Column Span">
          <select style={selectStyle}><option>1 col</option><option>2 col</option></select>
        </SettingRow>
        <SettingRow label="Show Labels by Default"><Toggle value={true} onChange={() => {}} /></SettingRow>
        <SettingRow label="Allow Pinning"><Toggle value={true} onChange={() => {}} /></SettingRow>
      </div>

      <div style={{ padding: 16, borderTop: `1px solid ${DS.border}`, display: "flex", gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, ...ghostBtn }}>Cancel</button>
        <button onClick={onClose} style={{ flex: 1, padding: "9px 0", background: DS.accent, border: "none", borderRadius: 4, fontWeight: 600, fontSize: 13, cursor: "pointer", color: DS.textMain }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ─── Reusable mini-components ─────────────────────────────────────────────────
const selectStyle = { fontSize: 12, border: `1px solid ${DS.border}`, borderRadius: 3, padding: "4px 8px", color: DS.textSecondary, background: DS.bgBase, cursor: "pointer" };
const inputStyle = { width: "100%", fontSize: 12, border: `1px solid ${DS.border}`, borderRadius: 3, padding: "6px 8px", color: DS.textSecondary, background: DS.bgBase, boxSizing: "border-box" };
const ghostBtn = { padding: "7px 0", background: DS.bgLight, border: `1px solid ${DS.border}`, borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: "pointer", color: DS.textSecondary };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: DS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 };

function SectionHeader({ children, style = {} }) {
  return <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: DS.textMuted, marginBottom: 8, marginTop: 4, ...style }}>{children}</div>;
}

function SettingRow({ label, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 36, height: 20, borderRadius: 10, background: value ? DS.accent : DS.bgLighter, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: value ? DS.textMain : DS.textMuted, transition: "left 0.2s" }} />
    </div>
  );
}

// ─── Field Tray ───────────────────────────────────────────────────────────────
function FieldTray({ object, sections, onDragStart }) {
  const [search, setSearch] = useState("");
  const allOnCanvas = new Set(sections.flatMap((s) => s.fields.map((f) => f.apiName)));
  const schema = FIELD_SCHEMA[object] || { standard: [], custom: [] };

  const filterFields = (fields) => fields.filter((f) => !allOnCanvas.has(f.apiName) && (f.label.toLowerCase().includes(search.toLowerCase()) || f.apiName.toLowerCase().includes(search.toLowerCase())));

  const available = { standard: filterFields(schema.standard), custom: filterFields(schema.custom) };

  return (
    <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${DS.border}`, background: DS.bgPanel }}>
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${DS.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: DS.textMuted, marginBottom: 6 }}>Available Fields</div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fields…"
          style={{ width: "100%", fontSize: 12, border: `1px solid ${DS.border}`, borderRadius: 3, padding: "5px 8px", boxSizing: "border-box", color: DS.textSecondary, background: DS.bgBase }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {["standard", "custom"].map((group) =>
          available[group].length > 0 ? (
            <div key={group} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: DS.textMuted, marginBottom: 4, paddingLeft: 2 }}>{group}</div>
              {available[group].map((f) => (
                <div
                  key={f.apiName}
                  draggable
                  onDragStart={(e) => onDragStart(e, { type: "tray-field", field: f })}
                  style={{ marginBottom: 4, padding: "7px 8px", background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 4, cursor: "grab", userSelect: "none" }}
                >
                  <div style={{ fontWeight: 600, fontSize: 12, color: DS.textMain }}>{f.label}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: DS.textMuted }}>{f.apiName}</span>
                    {fieldBadge(f.type)}
                  </div>
                </div>
              ))}
            </div>
          ) : null
        )}
        {available.standard.length === 0 && available.custom.length === 0 && (
          <div style={{ fontSize: 12, color: DS.textMuted, textAlign: "center", padding: "20px 0" }}>All fields are on the canvas</div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function AppBuilderCanvas() {
  const [selectedObject, setSelectedObject] = useState("Case");
  const [layouts, setLayouts] = useState(JSON.parse(JSON.stringify(DEFAULT_LAYOUTS)));
  const [showFieldPanel, setShowFieldPanel] = useState(null); // { sectionId, field }
  const [showCanvasSettings, setShowCanvasSettings] = useState(false);
  const [published, setPublished] = useState(false);
  const [toast, setToast] = useState(null);
  const [newSectionLabel, setNewSectionLabel] = useState("");
  const [showNewSection, setShowNewSection] = useState(false);
  const dragData = useRef(null);

  const sections = layouts[selectedObject] || [];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const updateLayout = useCallback((updater) => {
    setLayouts((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      updater(copy[selectedObject]);
      return copy;
    });
    setPublished(false);
  }, [selectedObject]);

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const handleDragStart = (e, data) => {
    dragData.current = data;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, targetSectionId, targetFieldApiName) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSectionId, targetFieldApiName) => {
    e.preventDefault();
    e.stopPropagation();
    const data = dragData.current;
    if (!data) return;

    updateLayout((secs) => {
      if (data.type === "tray-field") {
        const sec = secs.find((s) => s.id === targetSectionId);
        if (sec && !sec.fields.find((f) => f.apiName === data.field.apiName)) {
          sec.fields.push({ ...data.field, pinned: false, span: 1, showLabel: true, visible: true });
        }
      } else if (data.type === "field") {
        const fromSec = secs.find((s) => s.id === data.fromSection);
        const toSec = secs.find((s) => s.id === targetSectionId);
        if (!fromSec || !toSec) return;
        const fieldIdx = fromSec.fields.findIndex((f) => f.apiName === data.fieldApiName);
        if (fieldIdx === -1) return;
        const [moved] = fromSec.fields.splice(fieldIdx, 1);
        if (data.fromSection === targetSectionId) {
          toSec.fields.push(moved);
        } else {
          toSec.fields.push(moved);
        }
      } else if (data.type === "section") {
        const fromIdx = secs.findIndex((s) => s.id === data.sectionId);
        const toIdx = secs.findIndex((s) => s.id === targetSectionId);
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
        const [moved] = secs.splice(fromIdx, 1);
        secs.splice(toIdx, 0, moved);
      }
    });

    dragData.current = null;
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    const data = dragData.current;
    if (data?.type === "tray-field" && sections.length > 0) {
      handleDrop(e, sections[sections.length - 1].id, null);
    }
    dragData.current = null;
  };

  // ── Section / Field mutations ─────────────────────────────────────────────────
  const handleSectionLabelChange = (sectionId, label) => updateLayout((secs) => {
    const s = secs.find((x) => x.id === sectionId); if (s) s.label = label;
  });

  const handleSectionColsChange = (sectionId, cols) => updateLayout((secs) => {
    const s = secs.find((x) => x.id === sectionId); if (s) s.columns = cols;
  });

  const handleDisplayTypeChange = (sectionId, dt) => updateLayout((secs) => {
    const s = secs.find((x) => x.id === sectionId); if (s) s.displayType = dt;
  });

  const handleToggleCollapse = (sectionId) => updateLayout((secs) => {
    const s = secs.find((x) => x.id === sectionId); if (s) s.collapsed = !s.collapsed;
  });

  const handleDeleteSection = (sectionId) => updateLayout((secs) => {
    const idx = secs.findIndex((x) => x.id === sectionId);
    if (idx !== -1) secs.splice(idx, 1);
  });

  const handleToggleVisible = (sectionId, apiName) => updateLayout((secs) => {
    const s = secs.find((x) => x.id === sectionId);
    if (!s) return;
    const f = s.fields.find((x) => x.apiName === apiName);
    if (f) f.visible = !f.visible;
  });

  const handleFieldSettings = (sectionId, apiName) => {
    const sec = sections.find((s) => s.id === sectionId);
    const field = sec?.fields.find((f) => f.apiName === apiName);
    if (field) setShowFieldPanel({ sectionId, field });
  };

  const handleApplyFieldProps = (sectionId, apiName, props) => {
    updateLayout((secs) => {
      const s = secs.find((x) => x.id === sectionId);
      if (!s) return;
      const f = s.fields.find((x) => x.apiName === apiName);
      if (f) Object.assign(f, props);
    });
    setShowFieldPanel(null);
    showToast("Field properties updated");
  };

  const handleAddSection = () => {
    if (!newSectionLabel.trim()) return;
    updateLayout((secs) => secs.push(makeSection(newSectionLabel.trim())));
    setNewSectionLabel("");
    setShowNewSection(false);
    showToast("Section added");
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: DS.bgBase, color: DS.textMain, fontSize: 14 }}>
      {/* ── Toolbar ── */}
      <div style={{ height: 52, borderBottom: `1px solid ${DS.border}`, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", background: DS.bgPanel, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>⬡</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: DS.textMain }}>App Builder</span>
        </div>
        <div style={{ width: 1, height: 24, background: DS.border, margin: "0 4px" }} />
        {/* Object selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: DS.textMuted }}>Object:</span>
          <select
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value)}
            style={{ fontSize: 13, fontWeight: 600, border: `1px solid ${DS.border}`, borderRadius: 4, padding: "4px 8px", color: DS.textMain, background: DS.bgBase, cursor: "pointer" }}
          >
            {OBJECTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }} />
        {/* Canvas Settings gear */}
        <button
          onClick={() => setShowCanvasSettings(true)}
          style={{ padding: "6px 12px", borderRadius: 4, border: `1px solid ${DS.border}`, background: DS.bgLight, color: DS.textSecondary, fontWeight: 500, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
        >
          ⚙ Canvas Settings
        </button>
        {/* Revert */}
        <button
          onClick={() => { setLayouts((prev) => ({ ...prev, [selectedObject]: JSON.parse(JSON.stringify(DEFAULT_LAYOUTS[selectedObject])) })); showToast("Reverted to published layout", "info"); setPublished(true); }}
          style={{ padding: "6px 12px", borderRadius: 4, border: `1px solid ${DS.border}`, background: DS.bgLight, color: DS.textSecondary, fontWeight: 500, fontSize: 12, cursor: "pointer" }}
        >
          Revert
        </button>
        {/* Publish */}
        <button
          onClick={() => { setPublished(true); showToast("Layout published!"); }}
          disabled={published}
          style={{ padding: "6px 16px", borderRadius: 4, border: "none", background: published ? DS.bgLighter : DS.accent, color: published ? DS.textMuted : DS.textMain, fontWeight: 600, fontSize: 13, cursor: published ? "not-allowed" : "pointer", opacity: published ? 0.7 : 1 }}
        >
          {published ? "Published ✓" : "Publish"}
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Field Tray */}
        <FieldTray object={selectedObject} sections={sections} onDragStart={handleDragStart} />

        {/* Canvas */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnCanvas}
          style={{ flex: 1, overflowY: "auto", padding: 20, background: DS.bgBase }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {sections.map((section) => (
              <SectionBlock
                key={section.id}
                section={section}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onFieldSettings={handleFieldSettings}
                onToggleVisible={handleToggleVisible}
                onLabelChange={handleSectionLabelChange}
                onColsChange={handleSectionColsChange}
                onDisplayTypeChange={handleDisplayTypeChange}
                onToggleCollapse={handleToggleCollapse}
                onDelete={handleDeleteSection}
              />
            ))}

            {/* Add Section */}
            {showNewSection ? (
              <div style={{ background: DS.bgCard, border: `1px solid ${DS.border}`, borderRadius: 6, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: DS.textMain }}>New Section Label</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    autoFocus
                    value={newSectionLabel}
                    onChange={(e) => setNewSectionLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                    placeholder="e.g. Escalation Details"
                    style={{ flex: 1, fontSize: 13, border: `1px solid ${DS.accent}`, borderRadius: 4, padding: "7px 10px", color: DS.textSecondary, background: DS.bgBase }}
                  />
                  <button onClick={() => setShowNewSection(false)} style={{ padding: "7px 12px", borderRadius: 4, border: `1px solid ${DS.border}`, background: DS.bgLight, color: DS.textSecondary, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleAddSection} style={{ padding: "7px 14px", borderRadius: 4, border: "none", background: DS.accent, color: DS.textMain, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Add</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewSection(true)}
                style={{ width: "100%", padding: "12px 0", background: DS.bgBase, border: `2px dashed ${DS.border}`, borderRadius: 6, color: DS.textTertiary, fontSize: 13, cursor: "pointer" }}
              >
                + Add Section
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Panels ── */}
      {showFieldPanel && (
        <FieldPropertiesPanel
          field={showFieldPanel.field}
          sectionId={showFieldPanel.sectionId}
          onClose={() => setShowFieldPanel(null)}
          onApply={handleApplyFieldProps}
        />
      )}
      {showCanvasSettings && <CanvasSettingsPanel onClose={() => setShowCanvasSettings(false)} />}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: toast.type === "success" ? DS.success : DS.info, color: "#fff", padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 999 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
