import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bold, Italic, List, Link as LinkIcon, MoreHorizontal,
  Save, Plus, X, ChevronDown, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect';
import CommandPalette from '../components/CommandPalette';
import api from '../utils/api';

export default function NewCasePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    caseType: '',
    priority: '',
    category: '',
    subCategory: '',
    account: null,
    contact: null,
    asset: null,
    owner: 'Current User'
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const emptyForm = {
    subject: '',
    description: '',
    caseType: '',
    priority: '',
    category: '',
    subCategory: '',
    account: null,
    contact: null,
    asset: null,
    owner: 'Current User'
  };

  const validate = () => {
    const e = {};
    if (!formData.subject.trim())   e.subject   = 'Subject is required.';
    if (!formData.description.trim()) e.description = 'Description is required.';
    if (!formData.caseType)         e.caseType  = 'Case Type is required.';
    if (!formData.priority)         e.priority  = 'Priority is required.';
    if (!formData.account)          e.account   = 'Account is required.';
    if (!formData.contact)          e.contact   = 'Contact is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => ({
    subject:     formData.subject.trim(),
    description: formData.description.trim() || null,
    caseType:    formData.caseType,
    priority:    formData.priority,
    category:    formData.category  || null,
    subCategory: formData.subCategory || null,
    accountID:   formData.account?.id ?? null,
    contactID:   formData.contact?.id ?? null,
    assetID:     formData.asset?.id ?? null,
  });

  const handleCancel = () => navigate('/cases');

  const handleSaveCase = async () => {
    if (!validate()) return;
    setSaving(true);
    setSubmitError('');
    try {
      const res = await api.post('/cases', buildPayload());
      const created = res.data?.data;
      setSubmitSuccess(`Case ${created?.caseNumber || ''} created successfully!`);
      setTimeout(() => navigate(`/cases/${created?.caseID || ''}`), 1500);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.Message
        || 'Failed to create case. Please try again.';
      setSubmitError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndNew = async () => {
    if (!validate()) return;
    setSaving(true);
    setSubmitError('');
    try {
      await api.post('/cases', buildPayload());
      setFormData(emptyForm);
      setErrors({});
      setSubmitSuccess('Case created! Form cleared for a new entry.');
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.Message
        || 'Failed to create case. Please try again.';
      setSubmitError(msg);
    } finally {
      setSaving(false);
    }
  };

  const caseTypes = [
    { value: 'Request', label: 'Request' },
    { value: 'Incident', label: 'Incident' },
    { value: 'Problem', label: 'Problem' },
    { value: 'Change', label: 'Change Request' },
  ];

  const priorities = [
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const categories = [
    { value: 'Technical', label: 'Technical' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Hydraulic', label: 'Hydraulic' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Engine', label: 'Engine' },
    { value: 'General', label: 'General' },
  ];

  const subCategories = {
    Technical:   ['Software Bug', 'Hardware Failure', 'Configuration', 'Integration'],
    Billing:     ['Invoice Dispute', 'Overcharge', 'Payment Issue', 'Refund'],
    Emergency:   ['Equipment Down', 'Safety Risk', 'Production Halt'],
    Hydraulic:   ['Leak', 'Seal Failure', 'Pump Issue', 'Cylinder Damage'],
    Electrical:  ['Wiring', 'Sensor Fault', 'Short Circuit', 'Battery'],
    Mechanical:  ['Wear & Tear', 'Alignment', 'Vibration', 'Bearing Failure'],
    Engine:      ['Overheat', 'Oil Leak', 'Starter Fault', 'Exhaust'],
    General:     ['Other', 'Inquiry', 'Feedback'],
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        <div className="text-sm">
          <button onClick={() => navigate('/cases')} className="hover:text-brand-blue transition-colors" style={{ color: 'var(--text-muted)' }}>
            Cases
          </button>
          <span className="mx-2" style={{ color: 'var(--text-muted)' }}>/</span>
          <span className="font-medium">New Case</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Form Header */}
          <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h1 className="text-lg font-bold mb-1">CREATE NEW CASE</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>System Status: Nominal</p>
          </div>

          {/* Success Banner */}
          {submitSuccess && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46' }}>
              <CheckCircle size={16} />
              <span className="text-sm font-medium">{submitSuccess}</span>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{submitError}</span>
              <button onClick={() => setSubmitError('')} className="ml-auto" style={{ color: '#991B1B' }}><X size={14} /></button>
            </div>
          )}

          {/* Case Details Section */}
          <div className="mb-4 rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              CASE DETAILS
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Primary issue description and immediate context.
            </p>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                Case Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Centrifuge calibration error"
                value={formData.subject}
                onChange={(e) => { handleFieldChange('subject', e.target.value); if (errors.subject) setErrors(p => ({ ...p, subject: '' })); }}
                maxLength={200}
                className="w-full px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--bg-base)', border: `1px solid ${errors.subject ? '#C0392B' : 'var(--border)'}`, color: 'var(--text-main)' }}
              />
              <div className="flex justify-between mt-1">
                {errors.subject && <span className="text-xs" style={{ color: '#C0392B' }}>{errors.subject}</span>}
                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{formData.subject.length}/200</span>
              </div>
            </div>

            {/* Description with Rich Text Toolbar */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                Description <span className="text-red-500">*</span>
              </label>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Rich Text Supported</span>
              <div className="border rounded-lg overflow-hidden mt-2" style={{ borderColor: 'var(--border)' }}>
                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-base)' }}>
                  <button type="button" className="p-1.5 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Bold size={14} />
                  </button>
                  <button type="button" className="p-1.5 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Italic size={14} />
                  </button>
                  <button type="button" className="p-1.5 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <List size={14} />
                  </button>
                  <button type="button" className="p-1.5 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <LinkIcon size={14} />
                  </button>
                  <div className="flex-1"></div>
                  <button type="button" className="p-1.5 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                {/* Text Area */}
                <textarea
                  placeholder="Provide detailed steps to reproduce or observed symptoms..."
                  value={formData.description}
                  onChange={(e) => { handleFieldChange('description', e.target.value); if (errors.description) setErrors(p => ({ ...p, description: '' })); }}
                  rows={8}
                  className="w-full px-4 py-3 text-sm resize-none"
                  style={{ backgroundColor: 'var(--bg-base)', border: 'none', color: 'var(--text-main)' }}
                />
              </div>
              {errors.description && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.description}</p>}
            </div>
          </div>

          {/* Classification and Assignment - Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Classification Section */}
            <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                CLASSIFICATION
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Categorization for routing and reporting.
              </p>

              <div className="space-y-4">
                {/* Case Type */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Case Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.caseType}
                      onChange={(e) => { handleFieldChange('caseType', e.target.value); if (errors.caseType) setErrors(p => ({ ...p, caseType: '' })); }}
                      className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-base)', border: `1px solid ${errors.caseType ? '#C0392B' : 'var(--border)'}`, color: 'var(--text-main)' }}
                    >
                      <option value="">Select Type</option>
                      {caseTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  {errors.caseType && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.caseType}</p>}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => { handleFieldChange('priority', e.target.value); if (errors.priority) setErrors(p => ({ ...p, priority: '' })); }}
                      className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-base)', border: `1px solid ${errors.priority ? '#C0392B' : 'var(--border)'}`, color: 'var(--text-main)' }}
                    >
                      <option value="">Select Priority</option>
                      {priorities.map(prio => (
                        <option key={prio.value} value={prio.value}>{prio.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  {errors.priority && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.priority}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Sub-Category
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subCategory}
                      onChange={(e) => handleFieldChange('subCategory', e.target.value)}
                      disabled={!formData.category}
                      className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-50"
                      style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                    >
                      <option value="">{formData.category ? 'Select Sub-Category' : 'Select Category first'}</option>
                      {(subCategories[formData.category] || []).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="rounded-lg p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                ASSIGNMENT
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Entity relations and ownership.
              </p>

              <div className="space-y-4">
                {/* Account */}
                <SearchableSelect
                  label="Account"
                  placeholder="Search Accounts..."
                  endpoint="/search/accounts"
                  value={formData.account}
                  onChange={(item) => {
                    handleFieldChange('account', item);
                    handleFieldChange('contact', null);
                    handleFieldChange('asset', null);
                    setErrors(prev => ({ ...prev, account: '' }));
                  }}
                  onClear={() => {
                    handleFieldChange('account', null);
                    handleFieldChange('contact', null);
                    handleFieldChange('asset', null);
                  }}
                  required
                  error={errors.account}
                  renderValue={(item) => `${item.name} (${item.type})`}
                  renderOption={(item) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                          {item.type} • {item.city}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 6px', background: '#E8F1FF', color: '#0070D2', borderRadius: 3, whiteSpace: 'nowrap' }}>
                        {item.status}
                      </span>
                    </div>
                  )}
                />

                {/* Contact */}
                <SearchableSelect
                  label="Contact"
                  placeholder="Search Contacts..."
                  endpoint="/search/contacts"
                  value={formData.contact}
                  onChange={(item) => {
                    handleFieldChange('contact', item);
                    setErrors(prev => ({ ...prev, contact: '' }));
                  }}
                  onClear={() => handleFieldChange('contact', null)}
                  disabled={!formData.account}
                  required
                  error={errors.contact}
                  dependentValue={formData.account?.id}
                  renderValue={(item) => `${item.name} (${item.email})`}
                  renderOption={(item) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                          {item.email} • {item.title || 'No title'}
                        </div>
                      </div>
                    </div>
                  )}
                />

                {/* Related Asset */}
                <SearchableSelect
                  label="Related Asset"
                  placeholder="Search Assets..."
                  endpoint="/search/assets"
                  value={formData.asset}
                  onChange={(item) => {
                    handleFieldChange('asset', item);
                    setErrors(prev => ({ ...prev, asset: '' }));
                  }}
                  onClear={() => handleFieldChange('asset', null)}
                  disabled={!formData.account}
                  required={false}
                  error={errors.asset}
                  dependentValue={formData.account?.id}
                  renderValue={(item) => `${item.name} [${item.status}]`}
                  renderOption={(item) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                          {item.equipmentNumber} • {item.model}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 6px', background: '#E8FFF0', color: '#0B7F3D', borderRadius: 3, whiteSpace: 'nowrap' }}>
                        {item.status}
                      </span>
                    </div>
                  )}
                />

                {/* Owner */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Owner
                  </label>
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
                        ME
                      </div>
                      <div>
                        <div className="text-sm font-medium">Current User</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Service Advisor</div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded hover:bg-gray-500/20 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                More Options
                <ChevronDown size={14} className={showMoreOptions ? 'rotate-180' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                Save as Draft
              </button>
              <button
                onClick={handleSaveAndNew}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                Save & New
              </button>
              <button
                onClick={handleSaveCase}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-brand-blue hover:bg-brand-blueDark text-white transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? 'Saving...' : 'Save Case'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        onSelectAccount={(item) => {
          handleFieldChange('account', item);
          handleFieldChange('contact', null);
          handleFieldChange('asset', null);
        }}
        onSelectContact={(item) => {
          handleFieldChange('contact', item);
        }}
        onSelectAsset={(item) => {
          handleFieldChange('asset', item);
        }}
      />
    </div>
  );
}
