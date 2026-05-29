# User / Contact Account Details — Profile UI Design

> **System:** UT Service Console  
> **Record Type:** User / Contact Profile Detail View  
> **Example Record:** Ronny Marlissa — Business Consultant  
> **Layout:** 5-Layer Structure · 2-Column Body (Detail Form + Related Panel)  
> **Reference:** UT Service Console screenshot — User/Contact profile page  
> **Theme:** ⬛🟨 Black & Yellow — Primary `#F5C800` · Surface `#1A1A1A` · Base `#0D0D0D`

---

## Layout Overview

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#F5C800` | Accent, active states, CTA buttons |
| `--color-primary-dark` | `#C9A100` | Hover / pressed primary |
| `--color-primary-light` | `#FFF0A0` | Highlight, badge background |
| `--color-bg-base` | `#0D0D0D` | Page / outermost background |
| `--color-surface` | `#1A1A1A` | Card & panel surfaces |
| `--color-surface-raised` | `#242424` | Elevated card, dropdown |
| `--color-border` | `#2E2E2E` | Dividers, card outlines |
| `--color-border-accent` | `#F5C800` | Active tab underline, focused input |
| `--color-text-primary` | `#F0F0F0` | Body text on dark |
| `--color-text-secondary` | `#A0A0A0` | Muted labels, placeholders |
| `--color-text-on-primary` | `#0D0D0D` | Text on yellow backgrounds |
| `--color-danger` | `#FF4D4F` | Delete / error states |
| `--color-success` | `#52C41A` | Active / verified status |

### Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)           │  bg: #0D0D0D · border-bottom: 2px #F5C800
├─────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + Open Tabs / Recent History) │  bg: #1A1A1A · border-bottom: #2E2E2E
├─────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Profile Hero Banner                                  │  bg: cover image · overlay #0D0D0D 40%
│            (Banner image · Avatar · Name · Title · Actions)     │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Sub-Tab Bar (Details)                                │  bg: #141414 · active-tab: #F5C800
├──────────────────────────────────────────┬──────────────────────┤
│  LAYER 5 — COL 1 (Detail Form)           │  LAYER 5 — COL 2     │  bg: #0D0D0D
│  About · Contact · Background            │  Related Panel       │  cards: #1A1A1A
│  Chatter (Post · Question · Poll)        │  Files               │  border: #2E2E2E
│                                          │  Groups              │
│                                          │  Followers           │
│                                          │  Following           │
└──────────────────────────────────────────┴──────────────────────┘
```

---

## Layer 1 — Global Top Bar

**Position:** Fixed, full-width, topmost  
**Height:** ~36px  
**Background:** `#0D0D0D`  
**Border-Bottom:** `2px solid #F5C800`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | App launcher grid icon | 4×4 dot grid 18px · icon color `#F5C800` |
| Center | Global Search Bar | Placeholder: "Search…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · rounded pill ~320px · text `#F0F0F0` |
| Right | Icon cluster | Help `?`, Notifications bell (badge `#F5C800` / text `#0D0D0D`), User avatar, Settings gear — icons `#A0A0A0`, hover `#F5C800` |

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1, full-width  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | Console label | Icon square `#F5C800` + "UT Service Console" text `#F0F0F0` bold 14px |
| Left+1 | Module dropdown | "Cases ▾" · bg `#242424` · text `#F0F0F0` · hover-bg `#F5C800` · hover-text `#0D0D0D` |
| Center–Right | Open Tabs strip | Horizontal scrollable · active tab border-bottom `2px solid #F5C800` · text `#F5C800` font-weight 600 · inactive text `#A0A0A0` |
| Far Right | "More ▾" overflow | Same styling as module dropdown |

**Visible Tabs (from screenshot):**
- Gagas L. · 01175T… · contra... · DYA L. · BSA4... · Randi... · S.Fara... · Charl... · PSPMP... · 01032T (active) · Cara G... · Cara M... · Closed... · PJ220... · More ▾
- Active tab: "Ronny M..." — chip bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800`

---

## Layer 3 — Profile Hero Banner

**Position:** Below Layer 2  
**Height:** ~160px total (banner ~120px + identity strip ~40px)  
**Banner Background:** Full-width landscape illustration (hot air balloon / mountain scene)  
**Overlay:** `rgba(0, 0, 0, 0.35)` gradient from bottom for text legibility  
**Border-Bottom:** `1px solid #2E2E2E`

### Banner Sub-Components

```
┌──────────────────────────────────────────────────────────────────┐
│  [landscape banner image — full width ~120px tall]               │  📷 icon top-right
│                                                              [📷] │  icon: #A0A0A0 · hover: #F5C800
├──┬───────────────────────────────────────────────────────────────┤
│  │  [Avatar — 72px circle]                                       │
│  │  Ronny Marlissa          ← 18px #F0F0F0 font-weight 600       │
│  │  Business Consultant     ← 12px #A0A0A0                       │
└──┴───────────────────────────────────────────────────────────────┘
                                          [ + Follow ] [ Edit ] [ User Detail ]
```

| Component | Detail |
|-----------|--------|
| Banner image | Full-width decorative illustration · clickable via 📷 camera icon to replace |
| Camera icon | Position: top-right of banner · icon `#A0A0A0` · hover `#F5C800` · bg `rgba(0,0,0,0.4)` · border-radius `50%` · 28px |
| Avatar | 72px circle · border `3px solid #F5C800` · position: overlaps banner bottom-left · bg `#1A1A1A` (fallback) |
| Name | 18px · `#F0F0F0` · font-weight 600 |
| Title / Role | 12px · `#A0A0A0` (e.g. "Business Consultant") |

### Right Section — Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| + Follow | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#F5C800` | Subscribe to user activity feed |
| Edit | Outline · same hover | Open inline edit mode for profile fields |
| User Detail | **Primary filled** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` | Navigate to full user detail record |

---

## Layer 4 — Sub-Tab Bar

**Position:** Below Layer 3 (hero banner)  
**Height:** ~36px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Tab | State | Style |
|-----|-------|-------|
| Details | **Active** | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |

> Note: Only the **Details** tab is visible in the current view. Additional tabs (Activity, Chatter, Related) may be available depending on profile type.

---

## Layer 5 — Two-Column Body

**Layout:** CSS Grid `[1fr] [300px]`  
**Gap:** 12px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card / Section defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · shadow `0 2px 8px rgba(0,0,0,0.6)`  
> **Section header:** text `#F5C800` · font-size 13px · font-weight 600 · border-bottom `1px solid #2E2E2E` · collapse toggle icon `#F5C800`  
> **Field label:** text `#A0A0A0` · font-size 11px  
> **Field value:** text `#F0F0F0` · font-size 13px  
> **Link value:** color `#F5C800` · hover underline  
> **Checkbox checked:** accent `#F5C800`  
> **Row hover:** bg `#242424`

---

### Column 1 — Detail Form

**Width:** Flexible `1fr`  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

---

#### 1A. About

> Collapsible section · header label "About" · collapse toggle `#F5C800`  
> 2-column field layout (left / right sub-columns)

**Left Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Name | Ronny Marlissa | Full name · read-only display |
| Manager | RINALDI AKBAR RANGKUTI *(link)* | Lookup to manager's User record · link `#F5C800` · icon badge left of name |
| Role | BC Bali/Jatim | User role assignment · text `#F0F0F0` |
| Profile | MMT – NC | Profile/permission set label |

**Right Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Title | Business Consultant | Job title text · `#F0F0F0` |
| Company Name | PT UT | Company / org name · link `#F5C800` |
| Employee ID | — | HR employee identifier |
| EWS Button Display | — | Checkbox or text toggle |

---

#### 1B. Contact

> Collapsible section · header label "Contact" · same styling

**Left Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Email | ronnym@unitedtractors.com *(link)* | Mailto link · color `#F5C800` · hover underline |
| Mobile | +62 8118777089 | Phone number · `#F0F0F0` |

**Right Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Phone | — | Office/desk phone number |
| Address | — | Physical / mailing address |

---

#### 1C. Background

> Collapsible section · header label "Background" · same styling

| Field | Value | Notes |
|-------|-------|-------|
| About Me | *(empty / free text area)* | Multi-line text · bg `#141414` · border `#2E2E2E` · text `#F0F0F0` · placeholder `#4A4A4A` · min-height 80px |

---

#### 1D. Chatter

> Full-width section below the collapsible cards  
> **Background:** `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px`  
> **Section label:** "Chatter" · 13px · `#F5C800` · font-weight 600

**Sub-Tab Bar (within Chatter):**

| Tab | State | Style |
|-----|-------|-------|
| Post | **Active** | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Question | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |
| Poll | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |

**Post Compose Bar:**

| Component | Detail |
|-----------|--------|
| Text input | Placeholder: "Share an update…" · bg `#141414` · border `1px solid #2E2E2E` · focus-border `#F5C800` · text `#F0F0F0` · border-radius `4px` · full width |
| Share button | bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` · position: right of input |

**Sort / Filter Bar (below compose):**

| Component | Detail |
|-----------|--------|
| Sort dropdown | "Latest Posts ▾" · bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` |
| Search this feed... | Search input · bg `#141414` · border `#2E2E2E` · icon `#A0A0A0` · focus-border `#F5C800` · text `#F0F0F0` |
| Filter icon | icon `#A0A0A0` · hover `#F5C800` |
| Refresh icon | icon `#A0A0A0` · hover `#F5C800` |

**Feed Post Item (example):**

```
[Avatar — 28px circle · border #2E2E2E]
CTO-00030466 — Ronny Marlissa created a contract product delivery.
5h ago
```

| Component | Detail |
|-----------|--------|
| Post avatar | 28px circle · fallback bg `#2E2E2E` · border `1px solid #2E2E2E` |
| Post link | "CTO-00030466" · color `#F5C800` · font-weight 500 · hover underline |
| Post actor | "Ronny Marlissa" · color `#F5C800` · hover underline |
| Post body text | "created a contract product delivery." · color `#F0F0F0` · font-size 13px |
| Timestamp | "5h ago" · color `#A0A0A0` · font-size 11px |
| Expand icon | `▼` / `▲` · color `#A0A0A0` · position right · hover `#F5C800` |

---

### Column 2 — Related Panel (Right Sidebar)

**Width:** ~300px (fixed right)  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

> Header: "Related" · 13px · `#F5C800` · font-weight 600 · bg `#1A1A1A` · border-bottom `1px solid #2E2E2E`  
> Each row is a collapsible card with count badge and `[ + ]` expand button

---

#### 2A. Files (0)

> Collapsible card · header `#F5C800`

| Component | Detail |
|-----------|--------|
| Icon | Document icon · color `#F5C800` |
| Label | "Files (0)" · text `#F0F0F0` · font-size 13px |
| Count badge | `0` · bg `#2E2E2E` · text `#A0A0A0` · font-size 11px · border-radius `10px` · padding `2px 6px` |
| `[ + ]` expand button | top-right · bg `#F5C800` · text `#0D0D0D` · font-size 16px · hover bg `#C9A100` |
| Empty state | No files uploaded · text `#A0A0A0` |

---

#### 2B. Groups (0)

> Collapsible card · same styling

| Component | Detail |
|-----------|--------|
| Icon | People/group icon · color `#F5C800` |
| Label | "Groups (0)" · text `#F0F0F0` · font-size 13px |
| Count badge | `0` · bg `#2E2E2E` · text `#A0A0A0` |
| `[ + ]` expand button | bg `#F5C800` · text `#0D0D0D` |
| Empty state | No groups joined · text `#A0A0A0` |

---

#### 2C. Followers (0)

> Collapsible card · same styling

| Component | Detail |
|-----------|--------|
| Icon | Person+ icon · color `#F5C800` |
| Label | "Followers (0)" · text `#F0F0F0` · font-size 13px |
| Count badge | `0` · bg `#2E2E2E` · text `#A0A0A0` |
| `[ + ]` expand button | bg `#F5C800` · text `#0D0D0D` |
| Empty state | No followers · text `#A0A0A0` |

---

#### 2D. Following (0)

> Collapsible card · same styling

| Component | Detail |
|-----------|--------|
| Icon | Person arrow icon · color `#F5C800` |
| Label | "Following (0)" · text `#F0F0F0` · font-size 13px |
| Count badge | `0` · bg `#2E2E2E` · text `#A0A0A0` |
| `[ + ]` expand button | bg `#F5C800` · text `#0D0D0D` |
| Empty state | Not following anyone · text `#A0A0A0` |

---

## Interaction Patterns

### Follow Button (Header)
- **Off state:** border `#2E2E2E` · text `#A0A0A0` · label "+ Follow"
- **On state:** border `#F5C800` · text `#F5C800` · label "✓ Following" · icon bell filled
- Clicking off state → subscribes to user's activity feed, button flips to On state

### Edit Button (Header)
Opens all form fields in inline edit mode:
- Editable fields show border `1px solid #2E2E2E` · focus-border `#F5C800`
- Save button · bg `#F5C800` · text `#0D0D0D` · font-weight 600
- Cancel button · bg transparent · border `#2E2E2E` · text `#A0A0A0`

### User Detail Button (Primary CTA)
- Navigates to the full user system detail record (e.g. Salesforce User record)
- bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100`

### Banner / Avatar Photo Upload
- Camera icon `📷` top-right of banner: opens file picker → upload new banner image
- Avatar click: opens file picker → upload new profile photo
- Accepted formats: JPG, PNG · max 2MB

### Chatter Post Compose
- Click "Share an update…" input → expands compose area
- Supports @mentions: `@` triggers dropdown · bg `#242424` · matching text `#F5C800`
- Supports #hashtags, file attach
- `Share` button active only when input has content · disabled bg `#2E2E2E` · disabled text `#4A4A4A`

### Chatter Question Tab
- Opens a question compose form
- Question title: text input · bg `#141414` · border `#2E2E2E` · focus `#F5C800`
- Body: text area · same styling
- `Ask` button: bg `#F5C800` · text `#0D0D0D`

### Chatter Poll Tab
- Opens a poll compose form
- Question + options text inputs · same styling
- Duration dropdown · bg `#242424` · border `#2E2E2E`
- `Share` button: bg `#F5C800` · text `#0D0D0D`

---

## Typography Scale

> **Font family:** `'Inter', 'Segoe UI', sans-serif`

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Profile Name | 18px | 600 | `#F0F0F0` | Hero banner — user full name |
| Profile Title | 12px | 400 | `#A0A0A0` | Hero banner — job title / role |
| Section Title | 13px | 600 | `#F5C800` | Section / card headers |
| Field Label | 11px | 400 | `#A0A0A0` | Muted secondary labels |
| Field Value | 13px | 500 | `#F0F0F0` | Primary content |
| Link Value | 13px | 500 | `#F5C800` | Clickable / linked field value |
| Feed Post Body | 13px | 400 | `#F0F0F0` | Chatter post text |
| Feed Post Link | 13px | 500 | `#F5C800` | Record links in feed posts |
| Timestamp | 11px | 400 | `#A0A0A0` | Relative time (5h ago) |
| Tab Active | 13px | 600 | `#F5C800` | Active tab (Post, Details) |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Inactive tabs |
| Button Primary | 13px | 600 | `#0D0D0D` | CTA on `#F5C800` bg |
| Button Outline | 13px | 400 | `#A0A0A0` | Secondary / outline buttons |
| Badge Count | 11px | 500 | `#A0A0A0` | Related panel count chips |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Hover (row / card) | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Focused input | `#1A1A1A` | `#F5C800` | `#F0F0F0` |
| Active / Selected | `#2D2600` | `#F5C800` | `#F5C800` |
| Disabled | `#141414` | `#1A1A1A` | `#4A4A4A` |
| Danger hover | `#2D0000` | `#FF4D4F` | `#FF4D4F` |

---

## Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0D0D0D; }
::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #F5C800; }
```

---

## Component Hierarchy Summary

```
App
├── Layer 1: GlobalTopBar
│     ├── AppLauncher
│     ├── SearchBar
│     └── IconCluster (Help, Notifications, User, Settings)
│
├── Layer 2: AppBar
│     ├── ConsoleLabel ("UT Service Console")
│     ├── ModuleDropdown ("Cases ▾")
│     └── TabStrip (recent tabs + overflow)
│
├── Layer 3: ProfileHeroBanner
│     ├── BannerImage (full-width illustration + camera icon)
│     ├── AvatarCircle (72px · #F5C800 border)
│     ├── ProfileIdentity
│     │     ├── FullName (18px #F0F0F0)
│     │     └── JobTitle (12px #A0A0A0)
│     └── ActionButtons
│           ├── FollowButton (outline toggle)
│           ├── EditButton (outline)
│           └── UserDetailButton (primary yellow CTA)
│
├── Layer 4: SubTabBar
│     └── Tabs [Details]
│
└── Layer 5: BodyGrid (2 columns)
      ├── Column1: DetailForm
      │     ├── AboutSection
      │     │     ├── LeftSubColumn (Name, Manager, Role, Profile)
      │     │     └── RightSubColumn (Title, Company Name, Employee ID, EWS Button Display)
      │     ├── ContactSection
      │     │     ├── LeftSubColumn (Email, Mobile)
      │     │     └── RightSubColumn (Phone, Address)
      │     ├── BackgroundSection
      │     │     └── AboutMe (free-text area)
      │     └── ChatterSection
      │           ├── ChatterTabBar [Post | Question | Poll]
      │           ├── PostComposeBar (input + Share button)
      │           ├── FeedSortFilterBar (Sort dropdown + Search + Filter + Refresh)
      │           └── FeedList
      │                 └── FeedPostItem (Avatar · Link · Actor · Body · Timestamp)
      │
      └── Column2: RelatedPanel
            ├── RelatedHeader ("Related" #F5C800)
            ├── FilesCard (0)
            ├── GroupsCard (0)
            ├── FollowersCard (0)
            └── FollowingCard (0)
```

---

## Document Version

**Version 1.0** — UT Service Console User / Contact Account Details Profile Design  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-CaseManagement.md  
**Updated:** 2026-05-26
