import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map as MapIcon, Info, Settings, Users, MapPin, FileText, Plus } from 'lucide-react';
import {
  territoryById, plantById, workCenterById, membersForTerritory,
  formatPlainDate,
} from '../utils/serviceAreaData';
import { DetailHeader, Tabs, Section, FieldGrid, Field, RailCard, RailRow } from '../components/RecordDetail';

function MemberTypePill({ type }) {
  const isPrimary = type === 'Primary';
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium"
      style={isPrimary
        ? { backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)', border: '1px solid var(--accent)' }
        : { backgroundColor: 'var(--bg-light)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
      {type}
    </span>
  );
}

export default function ServiceTerritoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = territoryById(id);
  const [tab, setTab] = useState('Related');

  if (!t) {
    return <div className="p-6" style={{ color: 'var(--text-main)' }}>Territory not found. <button className="underline" onClick={() => navigate('/territories')}>Back</button></div>;
  }

  const plant = plantById(t.plant_id);
  const wc = workCenterById(t.work_center_id);
  const members = membersForTerritory(t.territory_id);

  const activeBadge = (
    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium"
          style={{ backgroundColor: 'rgba(56,142,60,0.12)', color: '#388E3C' }}>
      {t.is_active ? 'Active' : 'Inactive'}
    </span>
  );

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <DetailHeader icon={MapIcon} eyebrow="Service Territory" title={t.territory_name} badge={activeBadge} backTo="/territories?tab=territories"
        actions={<button className="btn-secondary px-3 py-1.5 text-sm">Edit</button>} />
      <Tabs tabs={['Related', 'Details']} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto items-start flex-col lg:flex-row">
          <div className="flex-1 min-w-0 w-full">
            {tab === 'Related' ? (
              <>
                <Section title={`Service Territory Members (${members.length})`} icon={Users}>
                  <div className="rounded-lg overflow-hidden mt-2" style={{ border: '1px solid var(--border)' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-light)' }}>
                          {['No.', 'Member Name', 'Territory Type', 'Role', 'Start Date'].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m, i) => (
                          <tr key={m.member_id} style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            <td className="px-3 py-2.5" style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                            <td className="px-3 py-2.5 font-medium" style={{ color: 'var(--accent-dark)' }}>{m.mechanic_name}</td>
                            <td className="px-3 py-2.5"><MemberTypePill type={m.territory_type} /></td>
                            <td className="px-3 py-2.5">{m.role}</td>
                            <td className="px-3 py-2.5 font-mono text-xs">{formatPlainDate(m.start_date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="btn-secondary px-3 py-1.5 text-xs mt-3"><Plus size={13} /> Add Member</button>
                </Section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Section title="Locations (1)" icon={MapPin}>
                    <div className="mt-2 px-3 py-2.5 rounded-lg flex items-center justify-between"
                         style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{wc?.wc_name || '—'}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Work Center</span>
                    </div>
                  </Section>
                  <Section title="Recent Cases (3)" icon={FileText}>
                    <div className="mt-2 space-y-1.5">
                      {[
                        { n: 'CS-2023-0841', s: 'In Progress', open: true },
                        { n: 'CS-2023-0812', s: 'Resolved' },
                        { n: 'CS-2023-0799', s: 'Resolved' },
                      ].map(c => (
                        <div key={c.n} className="flex items-center justify-between px-3 py-2 rounded-lg"
                             style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                          <span className="font-mono text-xs" style={{ color: 'var(--accent-dark)' }}>{c.n}</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium"
                                style={c.open
                                  ? { backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)' }
                                  : { backgroundColor: 'var(--bg-card)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>{c.s}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              </>
            ) : (
              <>
                <Section title="Information" icon={Info}>
                  <FieldGrid>
                    <Field label="Territory Name" value={t.territory_name} />
                    <Field label="Top-Level Territory" value={t.top_level_territory} />
                    <Field label="Plant" value={plant?.plant_name} accent />
                    <Field label="Work Center" value={wc?.wc_name} accent />
                    <Field label="Parent Territory" value={t.parent_territory_id} mono />
                    <Field label="Operating Hours" value={t.operating_hours_id} />
                    <Field label="Travel Mode" value={t.travel_mode} />
                    <Field label="Avg Travel Time" value={`${t.avg_travel_time_minutes} min`} />
                    <Field label="In-Territory Travel" value={`${t.typical_in_territory_travel} min`} />
                    <Field label="Active" value={t.is_active ? 'Yes' : 'No'} />
                  </FieldGrid>
                  <div className="mt-4"><Field label="Address" value={t.address} /></div>
                  <div className="mt-4"><Field label="Description" value={t.description} /></div>
                </Section>
                <Section title="System Information" icon={Settings} defaultOpen={false}>
                  <FieldGrid>
                    <Field label="Created By" value={t.created_by} />
                    <Field label="Created Date" value={formatPlainDate(t.created_date)} />
                    <Field label="Last Modified" value={formatPlainDate(t.modified_date)} />
                  </FieldGrid>
                </Section>
              </>
            )}
          </div>

          <aside className="w-full lg:w-80 flex-shrink-0">
            <RailCard title="Territory Details">
              <RailRow label="Operating Hours" value={t.operating_hours_id} />
              <RailRow label="Parent Territory" value={t.top_level_territory} accent />
              <div className="mt-2 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Description</div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t.description}</p>
            </RailCard>
            <RailCard title="System Info">
              <RailRow label="Created By" value={t.created_by} />
              <RailRow label="Created Date" value={formatPlainDate(t.created_date)} />
              <RailRow label="Last Modified" value={formatPlainDate(t.modified_date)} />
            </RailCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
