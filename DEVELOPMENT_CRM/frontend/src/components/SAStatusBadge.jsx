import React from 'react';
import { saStatusStyle } from '../utils/saData';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Service Appointment status badge.
 * Colour pairs follow FRD-Field-Service-Tracking §8.3 (light + dark).
 * Uses JetBrains-Mono-style uppercase label per the design spec.
 */
export default function SAStatusBadge({ status, size = 'sm' }) {
  const { isDark } = useTheme();
  const { bg, text } = saStatusStyle(status, isDark);
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium uppercase tracking-wide whitespace-nowrap ${pad}`}
      style={{ backgroundColor: bg, color: text, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
    >
      {status}
    </span>
  );
}
