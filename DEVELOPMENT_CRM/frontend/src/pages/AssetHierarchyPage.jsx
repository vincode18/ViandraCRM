import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, Network } from 'lucide-react';
import { assetById, rootAsset, buildTree } from '../utils/assetData';
import AssetStatusBadge from '../components/AssetStatusBadge';

/** Asset Hierarchy tree-grid view (FRD §7.2 / §10.4). */
export default function AssetHierarchyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = assetById(id);

  if (!asset) {
    return <div className="p-6" style={{ color: 'var(--text-main)' }}>Asset not found. <button className="underline" onClick={() => navigate('/assets')}>Back</button></div>;
  }

  const root = rootAsset(id);
  const tree = buildTree(root.id);

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
      <button onClick={() => navigate(`/assets/${id}`)} className="flex items-center gap-1 text-xs mb-4 hover:underline" style={{ color: 'var(--accent-dark)' }}>
        <ArrowLeft size={14} /> Back to {asset.name}
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Network size={20} style={{ color: 'var(--accent-dark)' }} />
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-main)' }}>Asset Hierarchy</h1>
      </div>
      <p className="text-sm mb-5" style={{ color: 'var(--text-tertiary)' }}>Root: <span className="font-medium">{root.name}</span></p>

      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <TreeNode node={tree} currentId={id} navigate={navigate} depth={0} />
      </div>
    </div>
  );
}

function TreeNode({ node, currentId, navigate, depth }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isCurrent = node.id === currentId;

  return (
    <div>
      <div className="flex items-center gap-1.5 py-1.5 rounded-lg transition-colors"
           style={{ paddingLeft: depth * 24, backgroundColor: isCurrent ? 'var(--accent-pale)' : 'transparent' }}>
        {hasChildren ? (
          <button onClick={() => setOpen(o => !o)} style={{ color: 'var(--text-muted)' }}>
            {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        ) : <span style={{ width: 15, display: 'inline-block' }} />}
        <button onClick={() => navigate(`/assets/${node.id}`)} className="flex items-center gap-2 text-left flex-1 min-w-0">
          <span className="text-sm truncate" style={{ color: 'var(--text-main)', fontWeight: isCurrent ? 600 : 400 }}>{node.name}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>L{node.level}</span>
          <AssetStatusBadge status={node.status} size="xs" />
        </button>
      </div>
      {hasChildren && open && node.children.map(c => (
        <TreeNode key={c.id} node={c} currentId={currentId} navigate={navigate} depth={depth + 1} />
      ))}
    </div>
  );
}
