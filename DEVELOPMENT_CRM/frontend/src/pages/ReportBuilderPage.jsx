/* ─────────────────────────────────────────────────────────────────────────
   Report Builder Page
   Drag-and-drop canvas for building custom reports
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Save, Download, MoreVertical, X, Filter, ArrowUpDown, Settings, Search, Plus, ChevronRight } from 'lucide-react';
import { loadReportById, saveReport, getReportData, exportReportCSV, REPORT_MODULES, FIELD_SCHEMA } from '../services/reportBuilderService';

export default function ReportBuilderPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('cases');
  const [selectedFields, setSelectedFields] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sorts, setSorts] = useState([]);
  const [configTab, setConfigTab] = useState('filters');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [columnNames, setColumnNames] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reportId && reportId !== 'new') {
      loadReport(reportId);
    } else {
      setReport({
        id: `report-${Date.now()}`,
        name: 'New Report',
        module: 'cases',
        description: '',
        fields: [],
        filters: [],
        sorts: [],
      });
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (report) {
      setSelectedModule(report.module);
      setSelectedFields(report.fields || []);
      setFilters(report.filters || []);
      setSorts(report.sorts || []);
      runReport();
    }
  }, [report]);

  const loadReport = async (id) => {
    setLoading(true);
    const response = await loadReportById(id);
    if (response.success) {
      setReport(response.data);
    }
    setLoading(false);
  };

  const runReport = async () => {
    if (!selectedModule || selectedFields.length === 0) return;
    const response = await getReportData(selectedModule, selectedFields, filters, sorts);
    if (response.success) {
      setReportData(response.data);
      setTotalRows(response.total);
    }
  };

  const handleSave = async () => {
    if (!report.name) {
      alert('Report name is required');
      return;
    }
    setSaving(true);
    const updatedReport = {
      ...report,
      module: selectedModule,
      fields: selectedFields,
      filters,
      sorts,
    };
    const response = await saveReport(updatedReport);
    if (response.success) {
      setReport(updatedReport);
      if (reportId === 'new') {
        navigate(`/reports/builder/${updatedReport.id}`);
      }
    }
    setSaving(false);
  };

  const handleAddField = (fieldId) => {
    if (selectedFields.includes(fieldId)) return;
    setSelectedFields([...selectedFields, fieldId]);
    setColumnNames(prev => ({ ...prev, [fieldId]: getFieldLabel(selectedModule, fieldId) }));
  };

  const handleRemoveField = (fieldId) => {
    setSelectedFields(selectedFields.filter(f => f !== fieldId));
    setColumnNames(prev => {
      const newNames = { ...prev };
      delete newNames[fieldId];
      return newNames;
    });
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const handleUpdateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleAddSort = () => {
    setSorts([...sorts, { field: '', direction: 'asc' }]);
  };

  const handleUpdateSort = (index, key, value) => {
    const newSorts = [...sorts];
    newSorts[index][key] = value;
    setSorts(newSorts);
  };

  const handleRemoveSort = (index) => {
    setSorts(sorts.filter((_, i) => i !== index));
  };

  const handleExport = async () => {
    await exportReportCSV(report, reportData);
  };

  const getFieldLabel = (module, fieldId) => {
    const schema = FIELD_SCHEMA[module];
    if (!schema) return fieldId;
    for (const group of schema.groups) {
      const field = group.fields.find(f => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const getAvailableFields = () => {
    const schema = FIELD_SCHEMA[selectedModule];
    if (!schema) return [];
    let fields = [];
    schema.groups.forEach(group => {
      group.fields.forEach(field => {
        if (!searchTerm || field.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          fields.push({ ...field, group: group.name });
        }
      });
    });
    return fields;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Loading report builder...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/reports')} className="btn-secondary p-1.5">
            <ArrowLeft size={16} />
          </button>
          <input
            type="text"
            value={report?.name || ''}
            onChange={e => setReport({ ...report, name: e.target.value })}
            className="input-field text-sm font-semibold"
            placeholder="Report Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runReport}
            className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2"
          >
            <Play size={14} /> Run Report
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleExport}
            disabled={reportData.length === 0}
            className="btn-primary px-3 py-1.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Field Panel (Left) */}
        <div className="w-[240px] flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="input-field text-sm w-full"
            >
              {REPORT_MODULES.map(module => (
                <option key={module.id} value={module.id}>{module.label}</option>
              ))}
            </select>
          </div>
          <div className="p-3">
            <div className="relative mb-3">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search fields…"
                className="input-field text-xs pl-7 w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3">
            {FIELD_SCHEMA[selectedModule]?.groups.map(group => (
              <div key={group.name} className="mb-2">
                <div
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-brand-light rounded"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ChevronRight size={10} style={{ transform: expandedGroups[group.name] ? 'rotate(90deg)' : 'rotate(0)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider">{group.name}</span>
                </div>
                {expandedGroups[group.name] && (
                  <div className="ml-2 mt-1">
                    {group.fields.map(field => {
                      const isSelected = selectedFields.includes(field.id);
                      return (
                        <div
                          key={field.id}
                          onClick={() => isSelected ? handleRemoveField(field.id) : handleAddField(field.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 mb-1 rounded cursor-move border transition-colors ${
                            isSelected ? 'opacity-50' : 'hover:bg-brand-light'
                          }`}
                          style={{
                            backgroundColor: isSelected ? 'var(--bg-lighter)' : 'var(--bg-card)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          <span className="text-sm" style={{ color: isSelected ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                            {field.label}
                          </span>
                          {field.pii && <span className="text-xs" style={{ color: 'var(--color-warning)' }}>🔒</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas (Center) */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="flex-1 overflow-auto">
            {selectedFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
                <Plus size={48} className="mb-3" />
                <p className="text-sm">Drag fields from the left panel to add columns</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-light)' }}>
                    {selectedFields.map(fieldId => (
                      <th key={fieldId} className="px-4 py-2 text-left font-medium border-r" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={columnNames[fieldId] || getFieldLabel(selectedModule, fieldId)}
                            onChange={e => setColumnNames(prev => ({ ...prev, [fieldId]: e.target.value }))}
                            className="bg-transparent border-none text-xs font-medium w-full"
                          />
                          <button
                            onClick={() => handleRemoveField(fieldId)}
                            className="ml-2 p-1 hover:bg-brand-light rounded"
                          >
                            <X size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {selectedFields.map(fieldId => (
                        <td key={fieldId} className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                          {row[fieldId] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-4 py-2 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
            Showing {reportData.length} of {totalRows} rows — export will include all {totalRows} rows
          </div>
        </div>

        {/* Configuration Panel (Right) */}
        <div className="w-[280px] flex-shrink-0 flex flex-col border-l" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="px-3 py-2 border-b flex" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setConfigTab('filters')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${configTab === 'filters' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}
              style={{ borderBottom: configTab === 'filters' ? '2px solid var(--accent)' : 'none' }}
            >
              Filters ({filters.length})
            </button>
            <button
              onClick={() => setConfigTab('sort')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${configTab === 'sort' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}
              style={{ borderBottom: configTab === 'sort' ? '2px solid var(--accent)' : 'none' }}
            >
              Sort ({sorts.length})
            </button>
            <button
              onClick={() => setConfigTab('properties')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${configTab === 'properties' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}
              style={{ borderBottom: configTab === 'properties' ? '2px solid var(--accent)' : 'none' }}
            >
              Properties
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {configTab === 'filters' && (
              <div>
                {filters.map((filter, index) => (
                  <div key={index} className="mb-3 p-3 rounded border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Filter {index + 1}</span>
                      <button onClick={() => handleRemoveFilter(index)} className="p-1 hover:bg-brand-light rounded">
                        <X size={12} style={{ color: 'var(--color-danger)' }} />
                      </button>
                    </div>
                    <select
                      value={filter.field}
                      onChange={e => handleUpdateFilter(index, 'field', e.target.value)}
                      className="input-field text-xs w-full mb-2"
                    >
                      <option value="">Select field</option>
                      {selectedFields.map(field => (
                        <option key={field} value={field}>{getFieldLabel(selectedModule, field)}</option>
                      ))}
                    </select>
                    <select
                      value={filter.operator}
                      onChange={e => handleUpdateFilter(index, 'operator', e.target.value)}
                      className="input-field text-xs w-full mb-2"
                    >
                      <option value="equals">equals</option>
                      <option value="contains">contains</option>
                      <option value="starts with">starts with</option>
                    </select>
                    <input
                      type="text"
                      value={filter.value}
                      onChange={e => handleUpdateFilter(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="input-field text-xs w-full"
                    />
                  </div>
                ))}
                <button onClick={handleAddFilter} className="w-full py-2 border-2 border-dashed rounded text-xs flex items-center justify-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <Plus size={12} /> Add Filter
                </button>
              </div>
            )}

            {configTab === 'sort' && (
              <div>
                {sorts.map((sort, index) => (
                  <div key={index} className="mb-3 p-3 rounded border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Sort {index + 1}</span>
                      <button onClick={() => handleRemoveSort(index)} className="p-1 hover:bg-brand-light rounded">
                        <X size={12} style={{ color: 'var(--color-danger)' }} />
                      </button>
                    </div>
                    <select
                      value={sort.field}
                      onChange={e => handleUpdateSort(index, 'field', e.target.value)}
                      className="input-field text-xs w-full mb-2"
                    >
                      <option value="">Select column</option>
                      {selectedFields.map(field => (
                        <option key={field} value={field}>{getFieldLabel(selectedModule, field)}</option>
                      ))}
                    </select>
                    <select
                      value={sort.direction}
                      onChange={e => handleUpdateSort(index, 'direction', e.target.value)}
                      className="input-field text-xs w-full"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                ))}
                <button onClick={handleAddSort} className="w-full py-2 border-2 border-dashed rounded text-xs flex items-center justify-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <Plus size={12} /> Add Sort
                </button>
              </div>
            )}

            {configTab === 'properties' && (
              <div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Report Name
                  </label>
                  <input
                    type="text"
                    value={report?.name || ''}
                    onChange={e => setReport({ ...report, name: e.target.value })}
                    className="input-field text-sm w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Description
                  </label>
                  <textarea
                    value={report?.description || ''}
                    onChange={e => setReport({ ...report, description: e.target.value })}
                    className="input-field text-sm w-full"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Visibility
                  </label>
                  <select className="input-field text-sm w-full">
                    <option>Private (only me)</option>
                    <option>Shared (specific users)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
