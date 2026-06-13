/* ─────────────────────────────────────────────────────────────────────────
   Flow Builder Canvas Page
   Visual drag-and-drop canvas for building flow automations
   ───────────────────────────────────────────────────────────────────────── */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Undo, Redo, Maximize2, Settings, Save, Play, X, Plus, Zap, ChevronRight } from 'lucide-react';
import { loadFlowById, saveFlow, TOOLBOX_ELEMENTS, getFlowTypeColor } from '../services/flowBuilderService';

export default function FlowBuilderCanvasPage() {
  const navigate = useNavigate();
  const { flowId } = useParams();
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [toolboxTab, setToolboxTab] = useState('elements');
  const [inspectorTab, setInspectorTab] = useState('general');
  const [showFlowProperties, setShowFlowProperties] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadFlow();
  }, [flowId]);

  const loadFlow = async () => {
    setLoading(true);
    const response = await loadFlowById(flowId);
    if (response.success) {
      setFlow(response.data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!flow) return;
    const response = await saveFlow(flow);
    if (response.success) {
      alert('Flow saved successfully');
    }
  };

  const handleAddNode = (elementId) => {
    if (!flow) return;
    const element = [...TOOLBOX_ELEMENTS.interaction, ...TOOLBOX_ELEMENTS.logic, ...TOOLBOX_ELEMENTS.data]
      .find(e => e.id === elementId);
    if (!element) return;

    const newNode = {
      id: `node-${Date.now()}`,
      type: element.id,
      x: 200,
      y: 200,
      label: element.label,
    };

    setFlow({
      ...flow,
      nodes: [...flow.nodes, newNode],
    });
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowFlowProperties(false);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null);
      setShowFlowProperties(true);
    }
  };

  const handleNodeDrag = (e, node) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 64;
    const y = e.clientY - rect.top - 40;

    setFlow({
      ...flow,
      nodes: flow.nodes.map(n => n.id === node.id ? { ...n, x, y } : n),
    });
  };

  const getNodeColor = (type) => {
    const colors = {
      start: '#00897B',
      end: '#757575',
      decision: '#FF9500',
      assignment: '#FF9500',
      action: '#1E3A5F',
      'get-records': '#E91E8C',
      'create-records': '#E91E8C',
      'update-records': '#E91E8C',
      'delete-records': '#E91E8C',
      loop: '#FF9500',
      pause: '#FF9500',
      screen: '#1976D2',
      subflow: '#1976D2',
    };
    return colors[type] || '#757575';
  };

  const getNodeIcon = (type) => {
    const icons = {
      start: '▶',
      end: '■',
      decision: '◇',
      assignment: '≡',
      action: '⚙',
      'get-records': '🔍',
      'create-records': '➕',
      'update-records': '✏',
      'delete-records': '🗑',
      loop: '↻',
      pause: '⏸',
      screen: '🖥',
      subflow: '↩',
    };
    return icons[type] || '□';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Loading flow...
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
        Flow not found
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* Toolbar */}
      <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/flows')} className="btn-secondary p-1.5">
            <ArrowLeft size={16} />
          </button>
          <span className="font-bold text-sm">{flow.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary p-1.5" title="Undo">
            <Undo size={14} />
          </button>
          <button className="btn-secondary p-1.5" title="Redo">
            <Redo size={14} />
          </button>
          <button className="btn-secondary p-1.5" title="Fit to Screen">
            <Maximize2 size={14} />
          </button>
          <button
            onClick={() => setShowFlowProperties(true)}
            className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2"
          >
            <Settings size={14} /> Flow Properties
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2">
            <Save size={14} /> Save
          </button>
          <button className="btn-primary px-3 py-1.5 text-sm flex items-center gap-2">
            <Play size={14} /> Activate
          </button>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox Panel (Left) */}
        <div className="w-[280px] flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="px-3 py-2 border-b flex" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setToolboxTab('elements')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${toolboxTab === 'elements' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}
              style={{ borderBottom: toolboxTab === 'elements' ? '2px solid var(--accent)' : 'none' }}
            >
              Elements
            </button>
            <button
              onClick={() => setToolboxTab('manager')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${toolboxTab === 'manager' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)'}`}
              style={{ borderBottom: toolboxTab === 'manager' ? '2px solid var(--accent)' : 'none' }}
            >
              Manager
            </button>
          </div>

          {toolboxTab === 'elements' ? (
            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1" style={{ color: 'var(--text-muted)' }}>
                  Interaction
                </div>
                {TOOLBOX_ELEMENTS.interaction.map(el => (
                  <div
                    key={el.id}
                    draggable
                    onDragStart={(e) => setDraggedElement(el)}
                    onClick={() => handleAddNode(el.id)}
                    className="px-3 py-2 mb-2 rounded cursor-move border flex items-center gap-3 hover:bg-brand-light transition-colors"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <span className="text-xl">{el.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{el.label}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1" style={{ color: 'var(--text-muted)' }}>
                  Logic
                </div>
                {TOOLBOX_ELEMENTS.logic.map(el => (
                  <div
                    key={el.id}
                    draggable
                    onDragStart={(e) => setDraggedElement(el)}
                    onClick={() => handleAddNode(el.id)}
                    className="px-3 py-2 mb-2 rounded cursor-move border flex items-center gap-3 hover:bg-brand-light transition-colors"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <span className="text-xl">{el.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{el.label}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1" style={{ color: 'var(--text-muted)' }}>
                  Data
                </div>
                {TOOLBOX_ELEMENTS.data.map(el => (
                  <div
                    key={el.id}
                    draggable
                    onDragStart={(e) => setDraggedElement(el)}
                    onClick={() => handleAddNode(el.id)}
                    className="px-3 py-2 mb-2 rounded cursor-move border flex items-center gap-3 hover:bg-brand-light transition-colors"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                  >
                    <span className="text-xl">{el.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{el.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3">
              <div className="text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1" style={{ color: 'var(--text-muted)' }}>
                Variables
              </div>
              <div className="text-sm px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
                No variables defined yet. Click + to add a variable.
              </div>
              <button className="w-full mt-2 px-3 py-2 border-2 border-dashed rounded text-sm flex items-center justify-center gap-2" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                <Plus size={14} /> New Resource
              </button>
            </div>
          )}
        </div>

        {/* Canvas (Center) */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-auto relative"
          style={{ backgroundColor: 'var(--bg-base)', backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          onClick={handleCanvasClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedElement) {
              const rect = canvasRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left - 64;
              const y = e.clientY - rect.top - 40;
              const newNode = {
                id: `node-${Date.now()}`,
                type: draggedElement.id,
                x,
                y,
                label: draggedElement.label,
              };
              setFlow({
                ...flow,
                nodes: [...flow.nodes, newNode],
              });
              setDraggedElement(null);
            }
          }}
        >
          {/* Render Nodes */}
          {flow.nodes.map(node => (
            <div
              key={node.id}
              draggable
              onDragStart={(e) => e.stopPropagation()}
              onDrag={(e) => handleNodeDrag(e, node)}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node);
              }}
              className="absolute cursor-move transition-shadow"
              style={{
                left: node.x,
                top: node.y,
                minWidth: '96px',
                minHeight: '80px',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: selectedNode?.id === node.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                boxShadow: selectedNode?.id === node.id ? '0 0 0 4px rgba(245, 200, 0, 0.15)' : 'none',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: getNodeColor(node.type) }}
              >
                <span className="text-white text-sm">{getNodeIcon(node.type)}</span>
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{node.type.replace('-', ' ')}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{node.label}</div>
              {/* Connector port */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
            </div>
          ))}

          {/* Render Connectors */}
          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', width: '100%', height: '100%' }}>
            {flow.connections?.map((conn, i) => {
              const fromNode = flow.nodes.find(n => n.id === conn.from);
              const toNode = flow.nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 64;
              const y1 = fromNode.y + 80;
              const x2 = toNode.x + 64;
              const y2 = toNode.y;

              return (
                <g key={i}>
                  <path
                    d={`M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`}
                    fill="none"
                    stroke="#BDBDBD"
                    strokeWidth="2"
                  />
                  {conn.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2}
                      textAnchor="middle"
                      className="text-xs"
                      style={{ fill: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', padding: '2px 6px' }}
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Inspector Panel (Right) */}
        <div className="w-[320px] flex-shrink-0 flex flex-col border-l" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-panel)' }}>
          <div className="px-3 py-2 border-b flex" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setInspectorTab('general')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${inspectorTab === 'general' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}
              style={{ borderBottom: inspectorTab === 'general' ? '2px solid var(--accent)' : 'none' }}
            >
              General
            </button>
            <button
              onClick={() => setInspectorTab('configuration')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium ${inspectorTab === 'configuration' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}
              style={{ borderBottom: inspectorTab === 'configuration' ? '2px solid var(--accent)' : 'none' }}
            >
              Configuration
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode ? (
              <>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Label
                  </label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => {
                      setFlow({
                        ...flow,
                        nodes: flow.nodes.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n),
                      });
                      setSelectedNode({ ...selectedNode, label: e.target.value });
                    }}
                    className="input-field text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    API Name
                  </label>
                  <input
                    type="text"
                    value={selectedNode.id}
                    disabled
                    className="input-field text-sm"
                    style={{ backgroundColor: 'var(--bg-lighter)' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Type
                  </label>
                  <div className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{selectedNode.type}</div>
                </div>
              </>
            ) : showFlowProperties ? (
              <>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Flow Label
                  </label>
                  <input
                    type="text"
                    value={flow.label}
                    onChange={(e) => setFlow({ ...flow, label: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    API Name
                  </label>
                  <input
                    type="text"
                    value={flow.apiName}
                    onChange={(e) => setFlow({ ...flow, apiName: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Description
                  </label>
                  <textarea
                    value={flow.description}
                    onChange={(e) => setFlow({ ...flow, description: e.target.value })}
                    className="input-field text-sm"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-tertiary)' }}>
                    Flow Type
                  </label>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {FLOW_TYPES.find(t => t.id === flow.type)?.label || flow.type}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                Select a node or click the canvas to view properties
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
