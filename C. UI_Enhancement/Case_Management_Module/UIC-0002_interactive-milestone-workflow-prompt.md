# Interactive Arrow Milestone Workflow Component
## Technical Requirements & Implementation Prompt

---

## 1. Component Overview

An interactive milestone workflow component that displays case status progression using arrow/chevron styling. Users can select a target milestone and confirm the status change with a "Mark Status" button.

### Visual Reference:
```
[Open] ──→ [Assigned] ──→ [In Progress] ──→ [Resolved] ──→ [Closed] [Mark Status ↗]
```

---

## 2. Case Parameter Mapping

```javascript
const CASE_PARAMETER_MAPPING = {
  1: { 
    label: "Open", 
    color: "#4A90E2", 
    description: "Case Opened"
  },
  2: { 
    label: "Assigned", 
    color: "#0073E6", 
    description: "Case Assigned to Team"
  },
  3: { 
    label: "In Progress", 
    color: "#FFB81C", 
    description: "Work in Progress"
  },
  4: { 
    label: "Resolved", 
    color: "#34C759", 
    description: "Issue Resolved"
  },
  5: { 
    label: "Closed", 
    color: "#6C7681", 
    description: "Case Closed"
  }
}
```

---

## 3. Component Structure

### 3.1 HTML Structure
```html
<div class="milestone-workflow-container">
  
  <!-- Milestone Arrow Container -->
  <div class="milestone-arrows">
    
    <!-- Milestone Item 1: Open -->
    <div class="milestone-item" data-parameter="1" data-selected="true">
      <div class="milestone-box open">
        <span class="status-label">Open</span>
        <span class="status-percentage">100%</span>
      </div>
      <div class="arrow-connector"></div>
    </div>
    
    <!-- Milestone Item 2: Assigned -->
    <div class="milestone-item" data-parameter="2" data-selected="false">
      <div class="milestone-box assigned">
        <span class="status-label">Assigned</span>
        <span class="status-percentage">100%</span>
      </div>
      <div class="arrow-connector"></div>
    </div>
    
    <!-- Milestone Item 3: In Progress (Clickable) -->
    <div class="milestone-item" data-parameter="3" data-selected="false">
      <div class="milestone-box in-progress clickable">
        <span class="status-label">In Progress</span>
        <span class="status-percentage">0%</span>
      </div>
      <div class="arrow-connector"></div>
    </div>
    
    <!-- Milestone Item 4: Resolved -->
    <div class="milestone-item" data-parameter="4" data-selected="false">
      <div class="milestone-box resolved">
        <span class="status-label">Resolved</span>
        <span class="status-percentage">0%</span>
      </div>
      <div class="arrow-connector"></div>
    </div>
    
    <!-- Milestone Item 5: Closed -->
    <div class="milestone-item" data-parameter="5" data-selected="false">
      <div class="milestone-box closed">
        <span class="status-label">Closed</span>
        <span class="status-percentage">0%</span>
      </div>
    </div>
    
  </div>
  
  <!-- Mark Status Button -->
  <button class="mark-status-btn" id="markStatusBtn">
    Mark Status ↗
  </button>
  
</div>

<!-- Case Parameter Display (Hidden but available in JS) -->
<div class="case-parameter-display">
  <span>Case Parameter: <strong id="caseParameterValue">1</strong></span>
  <span>Current Status: <strong id="currentStatusLabel">Open</strong></span>
</div>
```

---

## 4. CSS Styling

### 4.1 Container Layout
```css
.milestone-workflow-container {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.milestone-arrows {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0;
}
```

### 4.2 Milestone Items (Arrow Boxes)
```css
.milestone-item {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 120px;
}

.milestone-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 4px 8px 8px 4px; /* Left-side arrow cut */
  min-height: 70px;
  min-width: 100px;
  font-weight: 600;
  color: white;
  position: relative;
  transition: all 0.3s ease;
  cursor: default;
  
  /* Arrow pointer effect on right */
  &::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 12px solid inherit;
    border-top: 35px solid transparent;
    border-bottom: 35px solid transparent;
  }
}

/* Status Colors */
.milestone-box.open {
  background-color: #4A90E2;
}

.milestone-box.assigned {
  background-color: #0073E6;
}

.milestone-box.in-progress {
  background-color: #FFB81C;
}

.milestone-box.resolved {
  background-color: #34C759;
}

.milestone-box.closed {
  background-color: #6C7681;
}

/* Clickable State */
.milestone-box.clickable {
  cursor: pointer;
  border: 3px solid #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.milestone-box.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.milestone-box.selected {
  border: 3px solid #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  transform: scale(1.08);
}
```

### 4.3 Arrow Connector Line
```css
.arrow-connector {
  flex: 1;
  height: 3px;
  background-color: #ddd;
  margin: 0 -12px 0 0;
  position: relative;
  z-index: 0;
}

/* Active arrow (completed stages) */
.milestone-item[data-active="true"] .arrow-connector {
  background-color: #4A90E2;
  height: 4px;
}
```

### 4.4 Status Labels
```css
.status-label {
  font-size: 14px;
  font-weight: 600;
  display: block;
}

.status-percentage {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.9;
  display: block;
}
```

### 4.5 Mark Status Button
```css
.mark-status-btn {
  padding: 12px 24px;
  background-color: #0073E6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mark-status-btn:hover {
  background-color: #0059b3;
  box-shadow: 0 4px 12px rgba(0, 115, 230, 0.3);
  transform: translateY(-2px);
}

.mark-status-btn:active {
  transform: translateY(0);
}

.mark-status-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.mark-status-btn.success {
  background-color: #34C759;
}
```

---

## 5. JavaScript Logic

### 5.1 Core Functions
```javascript
class MilestoneWorkflow {
  constructor() {
    this.currentParameter = 1; // Starting status
    this.selectedParameter = null; // User selected milestone
    this.caseData = {
      caseId: 'CASE-20260525-00101',
      caseParameter: 1
    };
    this.init();
  }
  
  init() {
    this.attachEventListeners();
    this.renderWorkflow();
  }
  
  attachEventListeners() {
    // Milestone click handlers
    document.querySelectorAll('.milestone-box.clickable').forEach(el => {
      el.addEventListener('click', (e) => this.selectMilestone(e));
    });
    
    // Mark Status button
    document.getElementById('markStatusBtn').addEventListener('click', () => {
      this.markStatus();
    });
  }
  
  selectMilestone(event) {
    // Clear previous selection
    document.querySelectorAll('.milestone-box').forEach(el => {
      el.classList.remove('selected');
      el.parentElement.removeAttribute('data-selected');
    });
    
    // Set new selection
    const box = event.currentTarget;
    this.selectedParameter = parseInt(box.parentElement.dataset.parameter);
    
    box.classList.add('selected');
    box.parentElement.setAttribute('data-selected', 'true');
    
    // Update button state
    this.updateButtonState();
  }
  
  markStatus() {
    if (this.selectedParameter === null || 
        this.selectedParameter <= this.currentParameter) {
      alert('Please select a valid milestone to advance');
      return;
    }
    
    // Validate: Can only advance one stage at a time
    if (this.selectedParameter > this.currentParameter + 1) {
      alert('You can only advance one stage at a time');
      return;
    }
    
    // Update case parameter
    this.caseData.caseParameter = this.selectedParameter;
    this.currentParameter = this.selectedParameter;
    
    // Update UI
    this.updateWorkflowUI();
    this.showSuccessMessage();
    this.clearSelection();
    this.updateButtonState();
    
    // Send to backend
    this.saveToBackend();
  }
  
  updateWorkflowUI() {
    // Update percentages and completion status
    document.querySelectorAll('.milestone-item').forEach(item => {
      const param = parseInt(item.dataset.parameter);
      const box = item.querySelector('.milestone-box');
      const percentage = item.querySelector('.status-percentage');
      
      if (param < this.currentParameter) {
        item.setAttribute('data-active', 'true');
        percentage.textContent = '100%';
        box.classList.add('completed');
      } else if (param === this.currentParameter) {
        item.setAttribute('data-active', 'true');
        percentage.textContent = '0%';
      } else {
        item.removeAttribute('data-active');
        percentage.textContent = '0%';
      }
    });
    
    // Update case parameter display
    document.getElementById('caseParameterValue').textContent = 
      this.currentParameter;
    document.getElementById('currentStatusLabel').textContent = 
      CASE_PARAMETER_MAPPING[this.currentParameter].label;
  }
  
  updateButtonState() {
    const btn = document.getElementById('markStatusBtn');
    
    if (this.selectedParameter === null) {
      btn.disabled = true;
      btn.textContent = 'Select a Milestone ↗';
    } else if (this.selectedParameter === this.currentParameter) {
      btn.disabled = true;
      btn.textContent = 'Current Status ↗';
    } else if (this.selectedParameter < this.currentParameter) {
      btn.disabled = true;
      btn.textContent = 'Cannot Revert Status ↗';
    } else if (this.selectedParameter > this.currentParameter + 1) {
      btn.disabled = true;
      btn.textContent = 'Advance One Stage at a Time ↗';
    } else {
      btn.disabled = false;
      const nextStatus = CASE_PARAMETER_MAPPING[this.selectedParameter].label;
      btn.textContent = `Mark Status: ${nextStatus} ↗`;
    }
  }
  
  clearSelection() {
    document.querySelectorAll('.milestone-box').forEach(el => {
      el.classList.remove('selected');
    });
    this.selectedParameter = null;
  }
  
  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-toast';
    message.textContent = `✓ Status updated to: ${
      CASE_PARAMETER_MAPPING[this.currentParameter].label
    }`;
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 3000);
  }
  
  saveToBackend() {
    // API call to update case
    fetch(`/api/cases/${this.caseData.caseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_parameter: this.currentParameter,
        status: CASE_PARAMETER_MAPPING[this.currentParameter].label,
        updated_at: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(data => console.log('Case updated:', data))
    .catch(err => console.error('Error:', err));
  }
  
  renderWorkflow() {
    this.updateWorkflowUI();
    this.updateButtonState();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new MilestoneWorkflow();
});
```

---

## 6. User Interaction Flow

### Step 1: Initial View
```
User sees workflow:
[Open] ─→ [Assigned] ─→ [In Progress] ─→ [Resolved] ─→ [Closed]
Current Status: Open (Parameter: 1)
Button: "Select a Milestone ↗" [Disabled]
```

### Step 2: Click Milestone
```
User clicks "In Progress" box
[Open] ─→ [Assigned] ─→ [In Progress*] ─→ [Resolved] ─→ [Closed]
                              ↑ Golden border + glow
Button: "Mark Status: In Progress ↗" [Enabled - Blue]
```

### Step 3: Click Mark Status
```
User clicks "Mark Status: In Progress ↗"
[Open] ─→ [Assigned] ─→ [In Progress] ─→ [Resolved] ─→ [Closed]
 ✓100%     ✓100%       ✓0%
                    ↑ Now current status
Case Parameter: 3
Success Toast: "✓ Status updated to: In Progress"
Button: "Select a Milestone ↗" [Disabled - Reset for next selection]
```

### Step 4: Next Advancement
```
User clicks "Resolved"
[Open] ─→ [Assigned] ─→ [In Progress] ─→ [Resolved*] ─→ [Closed]
 ✓100%     ✓100%       ✓100%            ↑ Golden border
Button: "Mark Status: Resolved ↗" [Enabled]

User clicks "Mark Status: Resolved ↗"
[Open] ─→ [Assigned] ─→ [In Progress] ─→ [Resolved] ─→ [Closed]
 ✓100%     ✓100%       ✓100%          ✓0%
Case Parameter: 4
```

---

## 7. Validation Rules

### 7.1 Advancement Rules
```javascript
VALIDATION_RULES = {
  canAdvance: (currentParam, selectedParam) => {
    // Can only advance to next stage
    return selectedParam === currentParam + 1;
  },
  
  canRevert: (currentParam, selectedParam) => {
    // Cannot go backwards
    return selectedParam < currentParam; // Should return false
  },
  
  isCurrentStage: (currentParam, selectedParam) => {
    return selectedParam === currentParam;
  }
}
```

### 7.2 Error Messages
```
Scenario 1: Trying to skip a stage
❌ "You can only advance one stage at a time"

Scenario 2: Trying to go backwards
❌ "Cannot revert to a previous status"

Scenario 3: No milestone selected
❌ "Please select a milestone first"

Scenario 4: Already at final stage
⚠️  "Case is already closed - No further changes"
```

---

## 8. Data Model

### 8.1 Case Object Structure
```javascript
{
  caseId: "CASE-20260525-00101",
  caseParameter: 3,                    // Current status parameter
  currentStatus: "In Progress",        // Text label (derived from param)
  priority: "Medium",
  createdDate: "2026-05-26",
  lastUpdatedDate: "2026-05-28",
  statusHistory: [
    {
      parameter: 1,
      status: "Open",
      timestamp: "2026-05-26T07:31:00Z"
    },
    {
      parameter: 2,
      status: "Assigned",
      timestamp: "2026-05-26T08:15:00Z"
    },
    {
      parameter: 3,
      status: "In Progress",
      timestamp: "2026-05-28T16:45:00Z"
    }
  ],
  workOrder: { /* ... */ },
  slaTracking: { /* ... */ }
}
```

---

## 9. Responsive Design

### Desktop (1200px+)
- Full horizontal arrow layout
- Buttons inline on right

### Tablet (768px-1199px)
- Arrows may wrap if needed
- Button below arrows

### Mobile (<768px)
- Vertical stacked layout
- Full-width buttons
- Touch-friendly targets (44px minimum)

---

## 10. Accessibility Requirements

✅ Keyboard Navigation
- Tab through milestones
- Enter to select
- Space to trigger "Mark Status"

✅ Screen Reader
- aria-label for each milestone
- aria-current for active stage
- aria-describedby for status description

✅ Color + Symbols
- Not relying on color alone
- Checkmarks (✓) for completed
- Clear labels on all elements

---

## 11. Animation & Transitions

```css
.milestone-box {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mark-status-btn {
  transition: all 0.2s ease;
}

/* Success animation */
@keyframes slideInSuccess {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.success-toast {
  animation: slideInSuccess 0.3s ease;
}
```

---

## 12. Testing Checklist

- [ ] Click each milestone in sequence
- [ ] Verify "Mark Status" button enables/disables correctly
- [ ] Verify case_parameter updates (1→2→3→4→5)
- [ ] Test keyboard navigation
- [ ] Test on mobile/tablet
- [ ] Verify backend API calls
- [ ] Test error scenarios (skip stage, revert, etc.)
- [ ] Test accessibility with screen reader
- [ ] Test timeline logging of status changes

---

**Component Name:** Interactive Arrow Milestone Workflow  
**Version:** 1.0  
**Status:** Ready for Development  
**Dependencies:** Vanilla JavaScript (No frameworks required)
