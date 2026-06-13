/* ─────────────────────────────────────────────────────────────────────────
   Reports List Page
   Lists all reports with search, filter, and actions
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Play, Edit, Copy, Trash2, FileSpreadsheet, Star } from 'lucide-react';
import { loadReports, deleteReport, REPORT_MODULES } from '../services/reportBuilderService';

export default function ReportsListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const response = await loadReports();
    if (response.success) {
      setReports(response.data);
    }
    setLoading(false);
  };

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    const response = await deleteReport(reportId);
    if (response.success) {
      await loadReports();
    }
  };

  const handleDuplicate = async (report) => {
    const { saveReport } = await import('../services/reportBuilderService');
    const duplicate = {
      ...report,
      id: `report-${Date.now()}`,
      name: `${report.name} (Copy)`,
      createdDate: new Date().toISOString(),
      lastRun: null,
    };
    const response = await saveReport(duplicate);
    if (response.success) {
      await loadReports();
    }
  };

  const handleExport = async (report) => {
    const { getReportData, exportReportCSV } = await import('../services/reportBuilderService');
    const dataResponse = await getReportData(report.module, report.fields, report.filters || [], report.sorts || []);
    if (dataResponse.success) {
      await exportReportCSV(report, dataResponse.data);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = !moduleFilter || report.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getModuleLabel = (moduleId) => {
    const module = REPORT_MODULES.find(m => m.id === moduleId);
    return module ? module.label : moduleId;
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Create and run custom reports across modules
            </p>
          </div>
          <button
            onClick={() => navigate('/reports/builder/new')}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus size={16} /> New Report
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 py-4 flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search reports…"
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All Modules</option>
          {REPORT_MODULES.map(module => (
            <option key={module.id} value={module.id}>{module.label}</option>
          ))}
        </select>
      </div>

      {/* Reports Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Loading reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileSpreadsheet size={48} className="mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-1">No reports yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                Create your first custom report
              </p>
              <button
                onClick={() => navigate('/reports/builder/new')}
                className="btn-primary px-4 py-2 flex items-center gap-2"
              >
                <Plus size={16} /> New Report
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Report Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Module
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Last Run
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Created By
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Created Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr
                    key={report.id}
                    className="border-b hover:bg-brand-light cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => navigate(`/reports/builder/${report.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{report.name}</span>
                      </div>
                      {report.description && (
                        <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{report.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)' }}>
                        {getModuleLabel(report.module)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(report.lastRun)}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {report.createdBy}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(report.createdDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/reports/builder/${report.id}`)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Run"
                        >
                          <Play size={14} style={{ color: 'var(--color-success)' }} />
                        </button>
                        <button
                          onClick={() => navigate(`/reports/builder/${report.id}`)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Edit"
                        >
                          <Edit size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(report)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Duplicate"
                        >
                          <Copy size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => handleExport(report)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Export CSV"
                        >
                          <FileSpreadsheet size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 rounded hover:bg-brand-light"
                          title="Delete"
                        >
                          <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
