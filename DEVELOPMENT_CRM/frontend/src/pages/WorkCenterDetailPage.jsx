import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wrench, Info, Settings, FileText, Map as MapIcon, ChevronRight } from 'lucide-react';
import {
  workCenterById, plantById, territoriesForWorkCenter, wcTypeLabel,
  formatSADate, formatPlainDate, formatCurrencyIDR,
} from '../utils/serviceAreaData';
import { DetailHeader, Tabs, Section, FieldGrid, Field, RailCard, RailRow } from '../components/RecordDetail';

export default function WorkCenterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const wc = workCenterById(id);
  const [tab, setTab] = useState('Details');

  if (!wc) {
    return <div className="p-6" style={{ color: 'var(--text-main)' }}>Work Center not found. <button className="underline" onClick={() => navigate('/workcenters')}>Back</button></div>;
  }

  const plant = plantById(wc.plant_id);
  const territories = territoriesForWorkCenter(wc.wc_id);
  const isFM = wc.wc_type === 'FM';

  const typeBadge = (
    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium"
          style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)', border: '1px solid var(--accent)' }}>
      {wc.wc_type}
    </span>
  );

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <DetailHeader icon={Wrench} eyebrow="Work Center" title={wc.wc_name} badge={typeBadge} backTo="/workcenters?tab=workcenters"
        actions={<>
          <button className="btn-secondary px-3 py-1.5 text-sm">New Contact</button>
          <button className="btn-primary px-3 py-1.5 text-sm">New Note</button>
        </>} />
      <Tabs tabs={['Details', 'Related']} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto items-start flex-col lg:flex-row">
          <div className="flex-1 min-w-0 w-full">
            {tab === 'Details' ? (
              <>
                <Section title="Information" icon={Info}>
                  <FieldGrid>
                    <Field label="Work Center Name" value={wc.wc_name} />
                    <Field label="Work Center Code" value={wc.wc_code} mono />
                    <Field label="Type" value={wcTypeLabel(wc.wc_type)} />
                    <Field label="Plant" value={plant?.plant_name} accent />
                    <Field label="Service Lead" value={wc.service_lead_id} />
                    <Field label="Operating Hours" value={wc.operating_hours_id} />
                    <Field label="Default SLA (Hours)" value={wc.default_sla_hours} />
                    <Field label="Active" value={wc.is_active ? 'Yes' : 'No'} />
                  </FieldGrid>
                  <div className="mt-4"><Field label="Description" value={wc.description} /></div>
                </Section>

                {isFM && (
                  <Section title="FM Contract Details" icon={FileText}>
                    <FieldGrid>
                      <Field label="Contract Reference" value={wc.fm_contract_ref} mono />
                      <Field label="Client Name" value={wc.fm_client_name} />
                      <Field label="Contract Start" value={formatPlainDate(wc.fm_contract_start)} />
                      <Field label="Contract End" value={formatPlainDate(wc.fm_contract_end)} />
                      <Field label="PM Schedule" value={wc.fm_pm_schedule} />
                      <Field label="Dedicated Resources" value={wc.fm_resource_count} />
                      <Field label="Contract Value" value={formatCurrencyIDR(wc.fm_contract_value)} />
                      <Field label="SLA Priority" value={wc.fm_sla_priority} />
                    </FieldGrid>
                    <div className="mt-4"><Field label="Scope of Work" value={wc.fm_scope_of_work} /></div>
                  </Section>
                )}

                <Section title="System Information" icon={Settings} defaultOpen={false}>
                  <FieldGrid>
                    <Field label="Created Date" value={formatSADate(wc.created_date)} />
                    <Field label="Last Modified" value={formatSADate(wc.modified_date)} />
                  </FieldGrid>
                </Section>
              </>
            ) : (
              <Section title={`Service Territories (${territories.length})`} icon={MapIcon}>
                {territories.length === 0 ? (
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>No territories.</p>
                ) : (
                  <div className="mt-2 space-y-1.5">
                    {territories.map(t => (
                      <button key={t.territory_id} type="button" onClick={() => navigate(`/territories/${t.territory_id}`)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left"
                        style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{t.territory_name}</div>
                          <div className="text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{t.travel_mode}</div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </div>

          <aside className="w-full lg:w-80 flex-shrink-0">
            <RailCard title="Quick Summary">
              <RailRow label="TYPE" value={wcTypeLabel(wc.wc_type)} accent />
              <RailRow label="PLANT" value={plant?.plant_name} />
              <RailRow label="TERRITORIES" value={territories.length} />
              <RailRow label="SLA" value={`${wc.default_sla_hours ?? '—'} h`} />
            </RailCard>
            <RailCard title="Activity Feed">
              {[
                { d: 'Record synchronized with SAP.', t: '2 hrs ago' },
                { d: `Territory updated to ${territories[0]?.territory_name || '—'}.`, t: 'Yesterday' },
              ].map((a, i) => (
                <div key={i} className="flex gap-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                  <div className="min-w-0">
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.d}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.t}</div>
                  </div>
                </div>
              ))}
            </RailCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
