import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bold, Italic, List, Link as LinkIcon, MoreHorizontal,
  Save, Plus, X, ChevronDown
} from 'lucide-react';

export default function NewCasePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    caseType: '',
    priority: '',
    category: '',
    subCategory: '',
    account: '',
    contact: '',
    asset: '',
    owner: 'Current User'
  });
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => navigate('/cases');
  const handleSaveCase = () => {
    // API call to save case
    console.log('Saving case:', formData);
    navigate('/cases');
  };

  const handleSaveAndNew = () => {
    // API call to save case
    console.log('Saving case:', formData);
    setFormData({
      subject: '',
      description: '',
      caseType: '',
      priority: '',
      category: '',
      subCategory: '',
      account: '',
      contact: '',
      asset: '',
      owner: 'Current User'
    });
  };

  const caseTypes = [
    { value: 'request', label: 'Request' },
    { value: 'incident', label: 'Incident' },
    { value: 'problem', label: 'Problem' },
    { value: 'change', label: 'Change Request' },
  ];

  const priorities = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const categories = [
    { value: 'hydraulic', label: 'Hydraulic' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'engine', label: 'Engine' },
  ];

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
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                maxLength={200}
                className="w-full px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              />
              <div className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {formData.subject.length}/200
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
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 text-sm resize-none"
                  style={{ backgroundColor: 'var(--bg-base)', border: 'none', color: 'var(--text-main)' }}
                />
              </div>
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
                      onChange={(e) => handleFieldChange('caseType', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                    >
                      <option value="">Select Type</option>
                      {caseTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => handleFieldChange('priority', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                    >
                      <option value="">Select Priority</option>
                      {priorities.map(prio => (
                        <option key={prio.value} value={prio.value}>{prio.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  </div>
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
                      <option value="">Select Category first</option>
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
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Account <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search Accounts..."
                    value={formData.account}
                    onChange={(e) => handleFieldChange('account', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                    style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search Contacts..."
                    value={formData.contact}
                    onChange={(e) => handleFieldChange('contact', e.target.value)}
                    disabled={!formData.account}
                    className="w-full px-4 py-2.5 rounded-lg text-sm disabled:opacity-50"
                    style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  />
                </div>

                {/* Related Asset */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                    Related Asset
                  </label>
                  <input
                    type="text"
                    placeholder="Search Assets..."
                    value={formData.asset}
                    onChange={(e) => handleFieldChange('asset', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                    style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  />
                </div>

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
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                Save & New
              </button>
              <button
                onClick={handleSaveCase}
                className="px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-brand-blue hover:bg-brand-blueDark text-white transition-colors"
              >
                <Save size={14} />
                Save Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
