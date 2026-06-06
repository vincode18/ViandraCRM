import React, { useState, useEffect } from 'react';
import { X, Calendar, Star, AlertCircle } from 'lucide-react';
import { DURATION_TYPES, SERVICE_TERRITORIES } from '../utils/saData';

/**
 * Book Appointment Modal — FRD-Field-Service-Tracking §5.3 / §5.4
 * ------------------------------------------------------------------
 * Opened from the Work Order Feed tab. Pre-fills fields from the
 * parent Work Order, validates per §5.4, and on submit creates a
 * Service Appointment (Status = Scheduled) returned via onCreate().
 *
 * Props:
 *   open        boolean
 *   onClose()   close handler
 *   onCreate(sa) called with the new SA payload on success
 *   workOrder   { workOrderNumber, subject, serviceTerritory, duration,
 *                 durationType, description, earliestStart, dueDate }
 */
export default function BookAppointmentModal({ open, onClose, onCreate, workOrder = {} }) {
  const wo = {
    workOrderNumber: workOrder.workOrderNumber || 'WO-9921',
    subject: workOrder.subject || 'PM Service - Excavator C320',
    serviceTerritory: workOrder.serviceTerritory || 'JKT ST (Jakarta)',
    duration: workOrder.duration ?? 9,
    durationType: workOrder.durationType || 'Hours',
    description: workOrder.description || '',
    earliestStart: workOrder.earliestStart || '',
    dueDate: workOrder.dueDate || '',
  };

  const blank = {
    subject: '',
    serviceTerritory: '',
    schedStart: '',
    schedEnd: '',
    duration: '',
    durationType: 'Hours',
    earliestStart: '',
    dueDate: '',
    arrivalWindowStart: '',
    arrivalWindowEnd: '',
    description: '',
    isOffsiteAppointment: false,
  };

  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  // Pre-fill from the parent Work Order each time the modal opens
  useEffect(() => {
    if (open) {
      setForm({
        ...blank,
        subject: wo.subject,
        serviceTerritory: wo.serviceTerritory,
        duration: wo.duration,
        durationType: wo.durationType,
        description: wo.description,
        earliestStart: wo.earliestStart,
        dueDate: wo.dueDate,
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape to close + focus trap basics (FRD §10.3)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  // Auto-calculate Scheduled End from Start + Duration (FRD §5.3)
  const recalcEnd = (start, duration, type) => {
    if (!start || !duration) return '';
    const d = new Date(start);
    if (Number.isNaN(d.getTime())) return '';
    const mins = type === 'Minutes' ? Number(duration) : Number(duration) * 60;
    const end = new Date(d.getTime() + mins * 60000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
  };

  const handleStartOrDuration = (key) => (e) => {
    const next = { ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    next.schedEnd = recalcEnd(next.schedStart, next.duration, next.durationType);
    setForm(next);
  };

  // Validation rules — FRD §5.4
  const validate = () => {
    const err = {};
    if (!form.subject.trim()) err.subject = 'Subject is required.';
    if (!form.serviceTerritory) err.serviceTerritory = 'Service Territory is required.';
    if (!form.schedStart) err.schedStart = 'Scheduled Start is required.';
    if (!form.schedEnd) err.schedEnd = 'Scheduled End is required.';
    if (!form.duration || Number(form.duration) <= 0) err.duration = 'Duration must be greater than zero.';
    if (form.schedStart && form.schedEnd && new Date(form.schedEnd) <= new Date(form.schedStart))
      err.schedEnd = 'Scheduled End must be after Scheduled Start.';
    if (form.earliestStart && form.dueDate && new Date(form.dueDate) <= new Date(form.earliestStart))
      err.dueDate = 'Due Date must be after Earliest Start Permitted.';
    if (form.arrivalWindowStart && form.arrivalWindowEnd && new Date(form.arrivalWindowEnd) <= new Date(form.arrivalWindowStart))
      err.arrivalWindowEnd = 'Arrival Window End must be after Arrival Window Start.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Offsite confirmation prompt (FRD §5.4)
    if (form.isOffsiteAppointment &&
        !window.confirm('This appointment will not include travel time in the schedule.')) {
      return;
    }
    const mins = form.durationType === 'Minutes' ? Number(form.duration) : Number(form.duration) * 60;
    const sa = {
      appointmentNumber: `SA-${Math.floor(10000 + Math.random() * 89999)}`,
      subject: form.subject,
      status: 'Scheduled',
      statusCategory: 'Scheduled',
      parentRecord: wo.workOrderNumber,
      parentRecordType: 'Work Order',
      serviceTerritory: form.serviceTerritory,
      duration: Number(form.duration),
      durationType: form.durationType,
      durationInMinutes: mins,
      schedStart: form.schedStart,
      schedEnd: form.schedEnd,
      earliestStart: form.earliestStart,
      dueDate: form.dueDate,
      arrivalWindowStart: form.arrivalWindowStart,
      arrivalWindowEnd: form.arrivalWindowEnd,
      description: form.description,
      isOffsiteAppointment: form.isOffsiteAppointment,
      scheduleMode: '—',
      assignedResource: '',
    };
    onCreate?.(sa);
    onClose();
  };

  const labelCls = 'block text-xs font-medium mb-1';
  const fieldCls = 'w-full px-3 py-2 rounded text-sm transition-all';
  const fieldStyle = { backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' };

  const Field = ({ id, label, required, error, children }) => (
    <div>
      <label htmlFor={id} className={labelCls} style={{ color: 'var(--text-tertiary)' }}>
        {label} {required && <span style={{ color: 'var(--accent-dark)' }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] flex items-center gap-1" style={{ color: 'var(--color-danger)' }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book Appointment"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-fadeIn"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 sticky top-0 z-10"
             style={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Book Appointment</h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--accent-dark)' }}>
              Work Order {wo.workOrderNumber} · {wo.subject}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
                  className="p-1.5 rounded-lg hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <Field id="sa-subject" label="Subject" required error={errors.subject}>
            <input id="sa-subject" type="text" value={form.subject} onChange={set('subject')}
                   className={fieldCls} style={fieldStyle} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="sa-start" label="Scheduled Start" required error={errors.schedStart}>
              <input id="sa-start" type="datetime-local" value={form.schedStart} onChange={handleStartOrDuration('schedStart')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
            <Field id="sa-end" label="Scheduled End" required error={errors.schedEnd}>
              <input id="sa-end" type="datetime-local" value={form.schedEnd} onChange={set('schedEnd')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field id="sa-duration" label="Duration" required error={errors.duration}>
              <input id="sa-duration" type="number" min="0" step="any" value={form.duration} onChange={handleStartOrDuration('duration')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
            <Field id="sa-duration-type" label="Duration Type" required>
              <select id="sa-duration-type" value={form.durationType} onChange={handleStartOrDuration('durationType')}
                      className={fieldCls} style={fieldStyle}>
                {DURATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field id="sa-territory" label="Service Territory" required error={errors.serviceTerritory}>
              <select id="sa-territory" value={form.serviceTerritory} onChange={set('serviceTerritory')}
                      className={fieldCls} style={fieldStyle}>
                <option value="">Select…</option>
                {SERVICE_TERRITORIES.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="sa-earliest" label="Earliest Start Permitted">
              <input id="sa-earliest" type="datetime-local" value={form.earliestStart} onChange={set('earliestStart')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
            <Field id="sa-due" label="Due Date" error={errors.dueDate}>
              <input id="sa-due" type="datetime-local" value={form.dueDate} onChange={set('dueDate')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="sa-aw-start" label="Arrival Window Start">
              <input id="sa-aw-start" type="datetime-local" value={form.arrivalWindowStart} onChange={set('arrivalWindowStart')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
            <Field id="sa-aw-end" label="Arrival Window End" error={errors.arrivalWindowEnd}>
              <input id="sa-aw-end" type="datetime-local" value={form.arrivalWindowEnd} onChange={set('arrivalWindowEnd')}
                     className={fieldCls} style={fieldStyle} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={form.isOffsiteAppointment} onChange={set('isOffsiteAppointment')}
                   className="w-4 h-4 rounded accent-amber-500" />
            Offsite Appointment <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(no travel time added)</span>
          </label>

          <Field id="sa-desc" label="Description">
            <textarea id="sa-desc" rows={3} value={form.description} onChange={set('description')}
                      className={fieldCls} style={fieldStyle} />
          </Field>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
                    className="px-4 py-2 rounded text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button type="submit"
                    className="px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: 'var(--accent)', color: '#1a1a1a' }}>
              <Star size={14} /> Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
