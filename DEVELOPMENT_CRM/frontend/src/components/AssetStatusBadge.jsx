import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ASSET_STATUS_TOKENS } from '../utils/assetData';

/** Asset status pill badge — theme-aware per DESIGN §1.2 token table. */
export default function AssetStatusBadge({ status, size = 'sm' }) {
  const { isDark } = useTheme();
  const t = ASSET_STATUS_TOKENS[status] || ASSET_STATUS_TOKENS.Obsolete;
  const bg = isDark ? t.darkBg : t.lightBg;
  const text = isDark ? t.darkText : t.lightText;
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${px}`}
          style={{ backgroundColor: bg, color: text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: text }} />
      {status}
    </span>
  );
}
