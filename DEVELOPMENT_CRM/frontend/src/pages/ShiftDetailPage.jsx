import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Info, Settings, Link2, CalendarClock, AlertCircle, ChevronRight } from 'lucide-react';
import {
  shiftByName, shiftStatusStyle, shiftDurationHours,
  formatShiftDateTime, formatShiftTime, saHistoryForResource, SERVICE_RESOURCES,
} from '../utils/shiftData';
import { territoryById } from '../utils/serviceAreaData';
import { DetailHeader, Tabs, Section, FieldGrid, Field, RailCard } from '../components/RecordDetail';

export default function ShiftDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shift = shiftByName(id);
  const [tab, setTab] = useState('Details');

  if (!shift) {
    return <div className="p-6" style={{ color: 'var(--text-main)' }}>Shift not found. <button className="underline" onClick={() => navigate('/shifts')}>Back</button></div>;
  }

  const res = SERVICE_RESOURCES.find(r => r.id === shift.serviceResourceId);
  const terr = territoryById(shift.serviceTerritoryId);
  const sb = shiftStatusStyle(shift.status);
  const saHistory = saHistoryForResource(shift.serviceResourceId);

  const statusBadge = (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: sb.bg, color: sb.color }}>{shift.status}</span>
  );

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <DetailHeader icon={Clock} eyebrow="Shift Record" title={shift.name} badge={statusBadge} backTo="/shifts"
        actions={<>
          <button className="btn-secondary px-3 py-1.5 text-sm">Edit</button>
          <button className="btn-primary px-3 py-1.5 text-sm">Approve</button>
        </>} />

      {/* Quick stats bar */}
      <div className="flex flex-wrap gap-8 px-6 py-3" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}>
        {[
          { l: 'Start Time', v: formatShiftDateTime(shift.startTime) },
          { l: 'End Time', v: formatShiftDateTime(shift.endTime) },
          { l: 'Duration', v: `${shiftDurationHours(shift)} hours` },
          { l: 'Resource', v: res?.name || '—' },
        ].map(s => (
          <div key={s.l}>
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
            <div className="text-sm font-mono mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.v}</div>
          </div>
        ))}
      </div>

      <Tabs tabs={['Details', 'Related']} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto items-start flex-col lg:flex-row">
          {/* LEFT column — Shift details */}
          <div className="flex-1 min-w-0 w-full">
            {tab === 'Details' ? (
              <>
                <Section title="Shift Information" icon={Info}>
                  <FieldGrid>
                    <Field label="Shift Template" value={shift.shiftTemplate} />
                    <Field label="Service Territory" value={terr?.territory_name} accent />
                    <Field label="Status" value={shift.status} />
                    <Field label="Type" value={shift.timeSlotType} />
                    <Field label="Label" value={shift.label} />
                    <Field label="Non-Standard" value={shift.isNonStandard ? 'Yes' : 'No'} />
                    <Field label="Holiday Shift" value={shift.isHoliday ? 'Yes' : 'No'} />
                    <Field label="Recordset Filter" value={shift.recordsetFilter} />
                    <Field label="Background Color" value={
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: shift.backgroundColor }} />
                        <span className="font-mono">{shift.backgroundColor}</span>
                      </span>} />
                  </FieldGrid>
                </Section>

                <Section title="Resource & Territory" icon={Link2}>
                  <FieldGrid>
                    <Field label="Service Resource" value={res?.name} />
                    <Field label="Resource Type" value={res?.level} />
                    <Field label="Job Profile" value={shift.jobProfile} />
                    <Field label="Service Territory" value={terr?.territory_name} accent />
                    <Field label="Plant / Location" value={shift.plantLocation} />
                  </FieldGrid>
                </Section>

                <Section title="System Information" icon={Settings} defaultOpen={false}>
                  <FieldGrid>
                    <Field label="Created By" value="System Admin · 22/10/2023, 14:30" />
                    <Field label="Last Modified By" value="Shift Supervisor A · 23/10/2023, 09:15" />
                  </FieldGrid>
                </Section>
              </>
            ) : (
              <>
                <Section title={`SA History (${saHistory.length})`} icon={CalendarClock}>
                  {saHistory.length === 0 ? (
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>No service appointments for this resource.</p>
                  ) : (
                    <div className="rounded-lg overflow-hidden mt-2" style={{ border: '1px solid var(--border)' }}>
                      <table className="w-full text-sm">
                        <thead><tr style={{ backgroundColor: 'var(--bg-light)' }}>
                          {['SA Number', 'Subject', 'Sched Start', 'Status', 'Work Order'].map(h => (
                            <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {saHistory.map(sa => (
                            <tr key={sa.appointmentNumber} className="cursor-pointer" onClick={() => navigate(`/serviceappointments/${encodeURIComponent(sa.appointmentNumber)}`)}
                                style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                              <td className="px-3 py-2.5 font-mono text-xs" style={{ color: 'var(--accent-dark)' }}>{sa.appointmentNumber}</td>
                              <td className="px-3 py-2.5">{sa.subject}</td>
                              <td className="px-3 py-2.5 font-mono text-xs">{formatShiftDateTime(sa.schedStart)}</td>
                              <td className="px-3 py-2.5">{sa.status}</td>
                              <td className="px-3 py-2.5 font-mono text-xs" style={{ color: 'var(--accent-dark)' }}>{sa.parentRecord}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Section>

                <Section title="Service Territory Links" icon={Link2}>
                  <div className="mt-2 space-y-1.5">
                    {terr && (
                      <button onClick={() => navigate(`/territories/${terr.territory_id}`)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left"
                        style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border)' }}>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{terr.territory_name}</span>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    )}
                  </div>
                </Section>
              </>
            )}
          </div>

          {/* RIGHT rail — Activity */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <RailCard title="Activity">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-danger)' }} />
                  <div>
                    <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--color-danger)' }}>Overdue · Yesterday</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>Safety Briefing Missing</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Mandatory safety sign-off required for {terr?.territory_name || 'this territory'}.</div>
                    <button className="btn-secondary px-3 py-1 text-xs mt-1.5">Resolve</button>
                  </div>
                </div>
                <div className="flex gap-2" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <CalendarClock size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-dark)' }} />
                  <div>
                    <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--accent-dark)' }}>Upcoming · Today 16:30</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>End of Shift Handover</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Prepare logs for NIGHT shift supervisor.</div>
                  </div>
                </div>
              </div>
            </RailCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
