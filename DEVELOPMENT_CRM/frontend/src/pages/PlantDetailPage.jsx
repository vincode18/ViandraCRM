import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Factory, Info, Settings, Wrench, Map as MapIcon, ChevronRight, Activity } from 'lucide-react';
import {
  plantById, siteTypeLabel, workCentersForPlant, territoriesForPlant,
  formatSADate, formatPlainDate,
} from '../utils/serviceAreaData';
import { DetailHeader, Tabs, Section, FieldGrid, Field, RailCard, RailRow } from '../components/RecordDetail';

export default function PlantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = plantById(id);
  const [tab, setTab] = useState('Details');

  if (!plant) {
    return <div className="p-6" style={{ color: 'var(--text-main)' }}>Plant not found. <button className="underline" onClick={() => navigate('/plants')}>Back</button></div>;
  }

  const workCenters = workCentersForPlant(plant.plant_id);
  const territories = territoriesForPlant(plant.plant_id);

  const statusBadge = (
    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium"
          style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)', border: '1px solid var(--accent)' }}>
      {plant.status?.toUpperCase()}
    </span>
  );

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <DetailHeader icon={Factory} eyebrow="Plant" title={plant.plant_name} badge={statusBadge} backTo="/plants"
        actions={<>
          <button className="btn-secondary px-3 py-1.5 text-sm">Clone</button>
          <button className="btn-primary px-3 py-1.5 text-sm">New Note</button>
        </>} />
      <Tabs tabs={['Details', 'Related']} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto items-start flex-col lg:flex-row">
          {/* Main column */}
          <div className="flex-1 min-w-0 w-full">
            {tab === 'Details' ? (
              <>
                <Section title="Information" icon={Info}>
                  <FieldGrid>
                    <Field label="Plant Name" value={plant.plant_name} />
                    <Field label="Plant Code" value={plant.plant_code} mono />
                    <Field label="Site Type" value={siteTypeLabel(plant.site_type)} />
                    <Field label="Active" value={plant.is_active ? 'Yes' : 'No'} />
                    <Field label="Address" value={plant.address} />
                    <Field label="City" value={plant.city} />
                    <Field label="Region / Province" value={plant.region} />
                    <Field label="Country" value={plant.country} />
                    <Field label="Latitude" value={plant.latitude} mono />
                    <Field label="Longitude" value={plant.longitude} mono />
                    <Field label="Operating Hours" value={plant.operating_hours} />
                    <Field label="Parent Plant" value={plant.parent_plant_id} mono />
                  </FieldGrid>
                  <div className="mt-4">
                    <Field label="Description" value={plant.description} />
                  </div>
                </Section>

                <Section title="System Information" icon={Settings} defaultOpen={false}>
                  <FieldGrid>
                    <Field label="Created By" value={`${plant.created_by}, ${formatSADate(plant.created_date)}`} />
                    <Field label="Last Modified By" value={`${plant.modified_by}, ${formatSADate(plant.modified_date)}`} />
                  </FieldGrid>
                </Section>
              </>
            ) : (
              <>
                <Section title={`Work Centers (${workCenters.length})`} icon={Wrench}>
                  <RelatedList rows={workCenters.map(w => ({
                    id: w.wc_id, title: w.wc_name, meta: `${w.wc_code} · ${w.wc_type}`,
                    onClick: () => navigate(`/workcenters/${w.wc_id}`),
                  }))} empty="No work centers." />
                </Section>
                <Section title={`Service Territories (${territories.length})`} icon={MapIcon}>
                  <RelatedList rows={territories.map(t => ({
                    id: t.territory_id, title: t.territory_name, meta: t.travel_mode,
                    onClick: () => navigate(`/territories/${t.territory_id}`),
                  }))} empty="No territories." />
                </Section>
              </>
            )}
          </div>

          {/* Right rail */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <RailCard title="Quick Summary">
              <RailRow label="STATUS" value={plant.status} accent />
              <RailRow label="CAPACITY" value={`${plant.capacity_pct}%`} />
              <RailRow label="WORK CENTERS" value={workCenters.length} />
              <RailRow label="TERRITORIES" value={territories.length} />
            </RailCard>

            <RailCard title="Activity" action={<Activity size={14} style={{ color: 'var(--text-muted)' }} />}>
              {[
                { t: 'Today, 09:42 AM', d: 'Work Order WO-8923 created for Maintenance.' },
                { t: 'Yesterday, 16:15 PM', d: 'Status changed from IDLE to ACTIVE.' },
                { t: 'Nov 2, 08:00 AM', d: 'System scheduled reboot completed successfully.' },
              ].map((a, i) => (
                <div key={i} className="flex gap-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>{a.t}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.d}</div>
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

function RelatedList({ rows, empty }) {
  if (!rows.length) return <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{empty}</p>;
  return (
    <div className="mt-2 space-y-1.5">
      {rows.map(r => (
        <button key={r.id} type="button" onClick={r.onClick}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors"
          style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-main)' }}>{r.title}</div>
            <div className="text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{r.meta}</div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
      ))}
    </div>
  );
}
