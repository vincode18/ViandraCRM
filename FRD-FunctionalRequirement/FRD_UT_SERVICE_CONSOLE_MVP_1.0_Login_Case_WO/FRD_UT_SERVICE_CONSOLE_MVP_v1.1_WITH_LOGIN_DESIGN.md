# UT Service Console — Enhanced Functional Requirements Document (FRD)
## MVP Phase 1: Login Page Design Integration + Case & Work Order Management

**Document Version:** 1.1 (Enhanced with Login Page Design)  
**Last Updated:** May 28, 2026  
**Status:** MVP Phase 1 - Design Complete  
**Target Stack:** .NET (C#) · ASP.NET Core · MySQL Server (SSMS) · React/HTML5

---

## Executive Summary

The **UT Service Console** is an enterprise service management system with an enhanced professional login interface. This FRD v1.1 integrates comprehensive login page design specifications with the core three modules: **Login Page Design**, **Case Management**, and **Work Order Management**.

---

## Table of Contents

1. [Login Page Design (NEW)](#login-page-design)
2. [System Overview](#system-overview)
3. [Login Module - Enhanced](#login-module)
4. [Case Management Module](#case-management)
5. [Work Order Module](#work-order-module)
6. [Database Framework](#database-framework)
7. [API Specifications](#api-specifications)
8. [UI/UX Flow](#uiux-flow)
9. [Non-Functional Requirements](#non-functional-requirements)
10. [Implementation Notes](#implementation-notes)

---

## LOGIN PAGE DESIGN

### Overview

The Login Page is the primary entry point for the UT Service Console, providing users with a professional, secure authentication interface with multiple login options (email/password, OAuth).

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  LEFT SIDE (45%) - LOGIN FORM        │  RIGHT SIDE (55%) - BACKGROUND     │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                      │                                     │
│  🏗️ UT SERVICE CONSOLE               │  [EQUIPMENT/MACHINERY IMAGE]       │
│  Logo & Branding                     │  Background with Dark Overlay      │
│                                      │  Logo/Company Info at Bottom       │
│  ────────────────────────────────    │                                     │
│                                      │                                     │
│  Login to your account               │  "Precision Diagnostics."          │
│  Subtitle text                       │  Supporting tagline text            │
│                                      │                                     │
│  ────────────────────────────────    │                                     │
│                                      │                                     │
│  FORM SECTION:                       │                                     │
│  ├─ Email input field                │                                     │
│  ├─ Password input field             │                                     │
│  ├─ Remember me checkbox             │                                     │
│  ├─ Forgot password link             │                                     │
│  ├─ Primary LOGIN button             │                                     │
│                                      │                                     │
│  ────────────────────────────────    │                                     │
│                                      │                                     │
│  OAUTH SECTION:                      │                                     │
│  ├─ Login with UT Account button     │                                     │
│  ├─ Login with Microsoft button      │                                     │
│                                      │                                     │
│  ────────────────────────────────    │                                     │
│                                      │                                     │
│  FOOTER:                             │                                     │
│  ├─ Sign up link                     │                                     │
│  ├─ Terms & Privacy links            │                                     │
│  ├─ Support links                    │                                     │
│                                      │                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Page Layout Specifications

#### Responsive Breakpoints
```
Desktop (> 1024px):
├─ Split layout (45% form + 55% background image)
├─ Left panel width: 500px
├─ Right panel: fluid
└─ Form center-aligned in left panel

Tablet (768px - 1024px):
├─ Form takes 60% width
├─ Background takes 40%
└─ Slightly reduced spacing

Mobile (< 768px):
├─ Full-width form (100%)
├─ Background image hidden or compressed
├─ Stack layout vertically
└─ Optimized touch targets (44px minimum)
```

#### Color Scheme (Dark Mode)

```
COLOR PALETTE:
├─ Background (Dark): #1a1a1a (rgb(26, 26, 26))
├─ Surface: #242424 (rgb(36, 36, 36))
├─ Text Primary: #ffffff (rgb(255, 255, 255))
├─ Text Secondary: #b0b0b0 (rgb(176, 176, 176))
├─ Primary Button: #0066cc (rgb(0, 102, 204)) - Blue
├─ Primary Hover: #0052a3 (rgb(0, 82, 163))
├─ Secondary Button: #333333 (rgb(51, 51, 51))
├─ Secondary Hover: #444444 (rgb(68, 68, 68))
├─ Input Background: #2a2a2a (rgb(42, 42, 42))
├─ Input Border: #3a3a3a (rgb(58, 58, 58))
├─ Input Focus: #0066cc (rgb(0, 102, 204))
├─ Link Color: #4a9eff (rgb(74, 158, 255))
├─ Link Hover: #6ab3ff (rgb(106, 179, 255))
├─ Error: #ff4444 (rgb(255, 68, 68))
├─ Success: #44cc44 (rgb(68, 204, 68))
└─ Warning: #ffaa00 (rgb(255, 170, 0))
```

### 1.2 Left Panel - Form Section

#### Header & Branding

```
SECTION: Brand Header
├─ Logo
│  ├─ Size: 40x40px minimum
│  ├─ Color: #ffffff
│  ├─ Font: Bold, 24px, Hanken Grotesk
│  ├─ Text: "UT SERVICE CONSOLE"
│  ├─ Margin Bottom: 40px
│  └─ Spacing: 24px from top, 32px left/right
│
├─ Headline
│  ├─ Text: "Login to your account"
│  ├─ Font: 28px bold, Hanken Grotesk
│  ├─ Color: #ffffff
│  ├─ Margin Bottom: 12px
│  └─ Letter Spacing: -0.02em
│
└─ Subtitle
   ├─ Text: "Welcome back! Please enter your details to access the console."
   ├─ Font: 14px regular, Hanken Grotesk
   ├─ Color: #b0b0b0
   ├─ Line Height: 1.5
   └─ Margin Bottom: 32px
```

#### Email Input Field

```
FIELD: Email Address
├─ Label
│  ├─ Text: "Email"
│  ├─ Font: 12px, bold, JetBrains Mono
│  ├─ Color: #b0b0b0
│  ├─ Margin Bottom: 8px
│  └─ Required Indicator: "*" in red #ff4444
│
├─ Input Box
│  ├─ Background: #2a2a2a
│  ├─ Border: 1px solid #3a3a3a
│  ├─ Border Radius: 4px
│  ├─ Padding: 12px 14px
│  ├─ Font: 14px, Hanken Grotesk
│  ├─ Text Color: #ffffff
│  ├─ Placeholder: "technician@ut-service.com"
│  ├─ Placeholder Color: #666666
│  ├─ Height: 44px (touch-friendly)
│  ├─ Icon (Left): 📧 Email icon, 18px, #666666
│  │
│  └─ STATES:
│     ├─ Default: Border #3a3a3a, BG #2a2a2a
│     ├─ Hover: Border #4a4a4a, BG #2a2a2a
│     ├─ Focus: Border #0066cc, BG #2a2a2a, Box-shadow: 0 0 0 3px rgba(0,102,204,0.1)
│     ├─ Error: Border #ff4444, BG #2a2a2a
│     ├─ Valid: Border #44cc44, BG #2a2a2a
│     └─ Disabled: Border #3a3a3a, BG #1a1a1a, Opacity: 0.5
│
├─ Validation Messages
│  ├─ Error: "Please enter a valid email address"
│  ├─ Font: 11px, Color: #ff4444
│  ├─ Icon: ⚠️ Warning icon
│  └─ Margin Top: 4px
│
└─ Field Spacing
   └─ Margin Bottom: 20px
```

#### Password Input Field

```
FIELD: Password
├─ Label
│  ├─ Text: "Password"
│  ├─ Font: 12px, bold, JetBrains Mono
│  ├─ Color: #b0b0b0
│  ├─ Margin Bottom: 8px
│  └─ Required Indicator: "*" in red #ff4444
│
├─ Input Box
│  ├─ Background: #2a2a2a
│  ├─ Border: 1px solid #3a3a3a
│  ├─ Border Radius: 4px
│  ├─ Padding: 12px 14px (left 40px for icon)
│  ├─ Font: 14px, Hanken Grotesk
│  ├─ Text Color: #ffffff
│  ├─ Type: password (masked by default)
│  ├─ Placeholder: "Enter your password"
│  ├─ Placeholder Color: #666666
│  ├─ Height: 44px
│  │
│  ├─ LEFT ICON (Lock)
│  │  ├─ Icon: 🔒 Lock icon
│  │  ├─ Size: 18px
│  │  ├─ Color: #666666
│  │  ├─ Position: Left padding 12px
│  │  └─ Cursor: Default
│  │
│  └─ RIGHT ICON (Show/Hide Toggle)
│     ├─ Icon: 👁️ Eye icon (closed by default)
│     ├─ Size: 18px
│     ├─ Color: #666666
│     ├─ Position: Right padding 12px
│     ├─ Cursor: Pointer
│     ├─ Hover Color: #ffffff
│     │
│     └─ TOGGLE BEHAVIOR:
│        ├─ Default: Mask password with dots (••••••)
│        ├─ Clicked: Show plain text
│        ├─ Clicked Again: Mask text again
│        ├─ Icon Change: 👁️ → 👁️‍🗨️ (open eye)
│        └─ Accessibility: Added aria-label and title
│
├─ STATES:
│  ├─ Default: Border #3a3a3a, BG #2a2a2a
│  ├─ Hover: Border #4a4a4a, BG #2a2a2a
│  ├─ Focus: Border #0066cc, BG #2a2a2a, Box-shadow: 0 0 0 3px rgba(0,102,204,0.1)
│  ├─ Error: Border #ff4444, BG #2a2a2a
│  ├─ Valid: Border #44cc44, BG #2a2a2a
│  └─ Disabled: Border #3a3a3a, BG #1a1a1a, Opacity: 0.5
│
├─ Validation Messages
│  ├─ Error: "Password is required" or "Password must be at least 8 characters"
│  ├─ Font: 11px, Color: #ff4444
│  ├─ Icon: ⚠️
│  └─ Margin Top: 4px
│
└─ Field Spacing
   └─ Margin Bottom: 24px
```

#### Remember Me & Forgot Password

```
ROW: Options Bar (Between Password & Login Button)
├─ Layout: Flex, space-between
├─ Height: 32px
├─ Margin Bottom: 20px
│
├─ LEFT: Remember Me Checkbox
│  ├─ Checkbox
│  │  ├─ Size: 18x18px
│  │  ├─ Border: 2px solid #3a3a3a
│  │  ├─ Border Radius: 2px
│  │  ├─ Checked Icon: ✓ (white)
│  │  ├─ Background (Checked): #0066cc
│  │  ├─ Cursor: Pointer
│  │  └─ Transition: 150ms ease-in-out
│  │
│  └─ Label
│     ├─ Text: "Remember me"
│     ├─ Font: 13px, Hanken Grotesk
│     ├─ Color: #b0b0b0
│     ├─ Margin Left: 8px
│     ├─ Cursor: Pointer
│     └─ User Select: None
│
└─ RIGHT: Forgot Password Link
   ├─ Text: "Forgot password?"
   ├─ Font: 13px, Hanken Grotesk
   ├─ Color: #4a9eff (link blue)
   ├─ Text Decoration: None (default)
   ├─ Cursor: Pointer
   ├─ Transition: Color 200ms
   │
   └─ STATES:
      ├─ Hover: Color #6ab3ff, Text Decoration: Underline
      ├─ Active: Color #0066cc
      ├─ Visited: Color #4a9eff
      └─ Focus: Outline 2px solid #0066cc, Outline Offset: 2px
```

#### Login Button

```
BUTTON: Primary Login Button
├─ Full Width: Yes (100% of form)
├─ Height: 44px
├─ Background: #0066cc (Blue)
├─ Border: None
├─ Border Radius: 4px
├─ Padding: 12px 24px
├─ Font: 14px, bold, Hanken Grotesk
├─ Font Color: #ffffff
├─ Text Transform: UPPERCASE
├─ Letter Spacing: 0.05em
├─ Cursor: Pointer
├─ Transition: All 200ms ease-in-out
│
├─ STATES:
│  ├─ Default
│  │  ├─ BG: #0066cc
│  │  ├─ Box Shadow: None
│  │  └─ Transform: Scale(1)
│  │
│  ├─ Hover
│  │  ├─ BG: #0052a3 (Darker blue)
│  │  ├─ Box Shadow: 0 4px 12px rgba(0,102,204,0.3)
│  │  └─ Transform: Scale(1.02)
│  │
│  ├─ Active
│  │  ├─ BG: #003d7a
│  │  ├─ Box Shadow: Inset 0 2px 4px rgba(0,0,0,0.3)
│  │  └─ Transform: Scale(0.98)
│  │
│  ├─ Focus
│  │  ├─ Outline: 2px solid #ffffff
│  │  ├─ Outline Offset: 2px
│  │  └─ BG: #0052a3
│  │
│  ├─ Loading
│  │  ├─ BG: #0052a3
│  │  ├─ Cursor: Not Allowed
│  │  ├─ Opacity: 0.8
│  │  └─ Display Spinner: Yes (right side, white)
│  │
│  ├─ Disabled
│  │  ├─ BG: #333333 (Gray)
│  │  ├─ Cursor: Not Allowed
│  │  ├─ Opacity: 0.5
│  │  └─ Text Color: #666666
│  │
│  └─ Error (If form invalid)
│     ├─ BG: #ff4444
│     ├─ Color: #ffffff
│     ├─ Text: "PLEASE FIX ERRORS"
│     └─ Shake Animation: 200ms ease-in-out
│
├─ Label: "LOGIN"
├─ Margin Bottom: 24px
│
└─ Accessibility
   ├─ Tab Index: Proper order
   ├─ ARIA Label: "Login button"
   ├─ Role: button
   └─ Keyboard: Enter key triggers submit
```

### 1.3 OAuth Section

```
DIVIDER: Social Login Separator
├─ Layout: Flex with centered text
├─ Margin: 24px 0
├─ Line Height: 1px, Color: #3a3a3a
├─ Text: "Or continue with"
├─ Font: 12px, Color: #b0b0b0
└─ Center: Yes
```

#### UT Account OAuth Button

```
BUTTON: UT Account OAuth Button
├─ Full Width: Yes
├─ Height: 44px
├─ Background: #1a3a5a (Dark blue, secondary)
├─ Border: 1px solid #0066cc
├─ Border Radius: 4px
├─ Padding: 12px 24px
├─ Font: 13px, bold, Hanken Grotesk
├─ Color: #ffffff
├─ Text: "🔒 LOGIN WITH UT ACCOUNT"
├─ Cursor: Pointer
├─ Margin Bottom: 12px
├─ Transition: All 200ms
│
├─ STATES:
│  ├─ Default: BG #1a3a5a, Border #0066cc
│  ├─ Hover: BG #0052a3, Border #003d7a, Box-shadow: 0 4px 12px rgba(0,102,204,0.2)
│  ├─ Active: BG #003d7a
│  ├─ Focus: Outline 2px solid #ffffff
│  └─ Disabled: Opacity: 0.5, Cursor: Not Allowed
│
├─ Icon
│  ├─ Icon: 🔒 Lock icon
│  ├─ Size: 16px
│  ├─ Margin Right: 8px
│  └─ Color: #ffffff
│
└─ Link
   └─ URL: /api/auth/oauth/ut (redirects to UT OAuth provider)
```

#### Microsoft OAuth Button

```
BUTTON: Microsoft OAuth Button
├─ Full Width: Yes
├─ Height: 44px
├─ Background: #0078d4 (Microsoft blue)
├─ Border: None
├─ Border Radius: 4px
├─ Padding: 12px 24px
├─ Font: 13px, bold, Hanken Grotesk
├─ Color: #ffffff
├─ Text: "🪟 LOGIN WITH MICROSOFT"
├─ Cursor: Pointer
├─ Margin Bottom: 24px
├─ Transition: All 200ms
│
├─ STATES:
│  ├─ Default: BG #0078d4
│  ├─ Hover: BG #006ec2, Box-shadow: 0 4px 12px rgba(0,120,212,0.3)
│  ├─ Active: BG #00549e
│  ├─ Focus: Outline 2px solid #ffffff
│  └─ Disabled: Opacity: 0.5, Cursor: Not Allowed
│
├─ Icon
│  ├─ Icon: 🪟 Windows icon
│  ├─ Size: 16px
│  ├─ Margin Right: 8px
│  └─ Color: #ffffff
│
└─ Link
   └─ URL: /api/auth/oauth/microsoft (redirects to Microsoft OAuth provider)
```

### 1.4 Footer Section

```
FOOTER: Login Page Footer
├─ Margin Top: 32px
├─ Padding Top: 24px
├─ Border Top: 1px solid #3a3a3a
├─ Text Align: Center
│
├─ Sign Up Link
│  ├─ Text: "Don't have an account? "
│  ├─ Font: 13px, Hanken Grotesk
│  ├─ Color: #b0b0b0
│  │
│  └─ Link Text: "Sign up here"
│     ├─ Color: #4a9eff
│     ├─ Text Decoration: Underline
│     ├─ Cursor: Pointer
│     └─ Hover: Color #6ab3ff
│
├─ Bottom Links
│  ├─ Layout: Flex, center, gap 16px
│  ├─ Font: 12px, Hanken Grotesk
│  ├─ Color: #666666
│  ├─ Margin Top: 16px
│  │
│  └─ Links:
│     ├─ "Terms of Service" → /terms
│     ├─ "Privacy Policy" → /privacy
│     ├─ "Contact Support" → /support
│     └─ "Help Center" → /help
│
└─ Copyright
   ├─ Text: "© 2026 UT Service Console. All rights reserved."
   ├─ Font: 11px, Color: #555555
   ├─ Margin Top: 16px
   └─ Text Align: Center
```

### 1.5 Right Panel - Background Section

```
RIGHT PANEL: Background & Information
├─ Width: 55% (on desktop)
├─ Background: Dark equipment/machinery image
├─ Image Position: Cover
├─ Image Repeat: No-repeat
├─ Image Size: Cover
│
├─ OVERLAY
│  ├─ Background: Linear gradient (top to bottom)
│  ├─ From: rgba(0, 0, 0, 0.4) at top
│  ├─ To: rgba(0, 0, 0, 0.7) at bottom
│  ├─ Position: Absolute, full coverage
│  └─ Z-Index: 1
│
├─ CONTENT (Z-Index: 2)
│  ├─ Position: Absolute, bottom-left
│  ├─ Padding: 48px
│  │
│  ├─ Headline
│  │  ├─ Text: "Precision Diagnostics."
│  │  ├─ Font: 32px, bold, Hanken Grotesk
│  │  ├─ Color: #ffffff
│  │  ├─ Margin Bottom: 16px
│  │  └─ Line Height: 1.3
│  │
│  ├─ Description
│  │  ├─ Text: "Access real-time telemetry, service history, and diagnostic codes for the entire UT fleet. Built for high-performance engineering teams."
│  │  ├─ Font: 14px, regular, Hanken Grotesk
│  │  ├─ Color: #d0d0d0
│  │  ├─ Line Height: 1.6
│  │  └─ Max Width: 80%
│  │
│  └─ Company Logo (Bottom Right)
│     ├─ Position: Absolute, bottom-right
│     ├─ Padding: 32px
│     ├─ Logo Size: 60x60px
│     ├─ Color: #ffffff
│     ├─ Opacity: 0.8
│     └─ Link: Company website
│
└─ HIDE ON MOBILE
   └─ Display: None (for screens < 768px)
```

### 1.6 Form Validation & Error Handling

```
VALIDATION RULES:
├─ Email
│  ├─ Required: Yes
│  ├─ Format: Valid email (RFC 5322 compliant)
│  ├─ Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
│  ├─ Max Length: 150 characters
│  ├─ Error Message: "Please enter a valid email address"
│  └─ Real-time Validation: On blur
│
└─ Password
   ├─ Required: Yes
   ├─ Min Length: 8 characters
   ├─ Allowed Characters: A-Z, a-z, 0-9, special chars
   ├─ Error Message: "Password is required"
   └─ Real-time Validation: On input (optional, for UX)

SUBMISSION VALIDATION:
├─ Client-side: Real-time (email format, required fields)
├─ Server-side: On submission (credentials verification)
└─ Errors: Display above form or inline

ERROR DISPLAY:
├─ Location: Below input field
├─ Font: 11px, Color: #ff4444
├─ Icon: ⚠️ Warning icon (left)
├─ Animation: Fade in 200ms
└─ Auto-clear: On input change
```

### 1.7 Loading & Submission States

```
LOADING STATE (During submission):
├─ Button
│  ├─ Label: "LOGGING IN..."
│  ├─ Icon: Spinner (animated, white)
│  ├─ Disabled: Yes
│  ├─ Opacity: 0.8
│  └─ Cursor: Not Allowed
│
├─ Form Fields
│  ├─ Disabled: Yes
│  ├─ Opacity: 0.6
│  └─ Cursor: Not Allowed
│
├─ Duration: 0.5-2 seconds (typical)
│
└─ Visual Feedback
   ├─ Spinner: 20px, rotating
   ├─ Animation Speed: 1s per rotation
   └─ Color: #0066cc

SUCCESS STATE:
├─ Button
│  ├─ Background: #44cc44 (Green)
│  ├─ Label: "✓ LOGGED IN"
│  └─ Duration: 2 seconds (then redirect)
│
├─ Redirect: /console (after 1-2 seconds)
├─ Store JWT Token: localStorage or httpOnly cookie
│
└─ Clear Form: Yes

ERROR STATE:
├─ Button
│  ├─ Background: #ff4444 (Red)
│  ├─ Label: "LOGIN FAILED"
│  ├─ Shake Animation: 200ms
│  └─ Re-enable: Yes (after 2 seconds)
│
├─ Error Message
│  ├─ Display: Below password field
│  ├─ Text: "Invalid email or password"
│  ├─ Color: #ff4444
│  └─ Icon: ⚠️
│
├─ Password Field
│  ├─ Clear: Optional (ask user preference)
│  └─ Focus: Return focus to password field
│
└─ Retry: Allow immediate retry
```

### 1.8 Accessibility Requirements

```
WCAG 2.1 AA COMPLIANCE:
├─ Color Contrast
│  ├─ Text on Background: Minimum 4.5:1
│  ├─ Button Text: Minimum 4.5:1
│  ├─ Links: Minimum 3:1
│  └─ Focus Indicators: Minimum 3:1 (3px outline)
│
├─ Keyboard Navigation
│  ├─ Tab Order: Logo → Email → Password → Remember → Forgot → Login → OAuth buttons → Footer links
│  ├─ Tab Index: Logical sequence (0, 1, 2, etc.)
│  ├─ Enter Key: Submits form
│  └─ Escape Key: (Optional) Cancel if needed
│
├─ Screen Reader Support
│  ├─ Form Label: <label> tags linked to inputs (for attribute)
│  ├─ Required Fields: aria-required="true"
│  ├─ Error Messages: aria-describedby linked to error text
│  ├─ Button Labels: Descriptive text (e.g., "Login with Microsoft")
│  ├─ Icons: aria-hidden="true" (decorative icons)
│  └─ Focus Announcements: Role="alert" for errors
│
├─ Form Fields
│  ├─ Labels: Always visible (not just placeholder)
│  ├─ Placeholder: Additional hint (not main label)
│  ├─ Error Association: linked via aria-describedby
│  ├─ Required Indicator: Marked with * and aria-required
│  └─ Helper Text: Font size ≥ 12px
│
├─ Focus Management
│  ├─ Visible Focus: Blue outline (#0066cc)
│  ├─ Focus Offset: 2px
│  ├─ Focus State: Applied to all interactive elements
│  └─ Focus Trap: On modal (if applicable)
│
├─ Motion & Animation
│  ├─ Prefers Reduced Motion: Respect user preference
│  ├─ Animation Duration: ≥ 200ms (readable)
│  └─ Flashing: Avoid (≤ 3 times per second)
│
└─ Mobile Accessibility
   ├─ Touch Target Size: Minimum 44x44px
   ├─ Spacing: 8px minimum between targets
   ├─ Text Size: Minimum 12px (16px recommended)
   ├─ Zoom: Not disabled (allow 200% zoom)
   └─ Orientation: Support both portrait & landscape
```

### 1.9 Responsive Design Specifications

```
DESKTOP (> 1024px):
├─ Layout: Split screen (45% form + 55% background)
├─ Form Width: 500px (fixed)
├─ Form Padding: 48px (left/right), 64px (top/bottom)
├─ Font Sizes: Full size
└─ Background: Image visible

TABLET (768px - 1024px):
├─ Layout: Split (60% form + 40% background)
├─ Form Width: Fluid, max 450px
├─ Form Padding: 40px
├─ Font Sizes: Slightly reduced
└─ Background: Compressed but visible

MOBILE (< 768px):
├─ Layout: Full width, stacked
├─ Form Width: 100%
├─ Form Padding: 24px
├─ Font Sizes: Reduced (headings 20px)
├─ Background: Hidden or blurred
├─ Button Height: 48px (larger for touch)
├─ Input Height: 48px
└─ Spacing: Increased (16px gaps)

MEDIA QUERIES:
├─ Desktop: @media (min-width: 1024px)
├─ Tablet: @media (min-width: 768px) and (max-width: 1023px)
└─ Mobile: @media (max-width: 767px)
```

### 1.10 Security Specifications

```
SECURITY FEATURES:
├─ HTTPS Only
│  ├─ Redirect: All HTTP → HTTPS
│  ├─ HSTS Header: Enabled
│  └─ SSL/TLS: 1.3 minimum
│
├─ Input Sanitization
│  ├─ Email: Validate format & sanitize
│  ├─ Password: Not sanitized (preserve exact input)
│  └─ XSS Prevention: Encode all user input
│
├─ Password Security
│  ├─ Transmission: HTTPS encrypted
│  ├─ Storage: Hashed (SHA-256, bcrypt, or Argon2)
│  ├─ Salting: Per-password salt
│  ├─ Never Log: Passwords never logged or displayed
│  └─ Auto-clear: Clear from memory after use
│
├─ CSRF Protection
│  ├─ CSRF Token: Include in form
│  ├─ Token Validation: Server-side verification
│  ├─ Token Expiration: 1 hour
│  └─ Token Refresh: On page load
│
├─ Rate Limiting
│  ├─ Failed Attempts: Max 5 per IP per 15 minutes
│  ├─ Account Lockout: 30 minutes after 5 failures
│  ├─ Password Reset Requests: Max 3 per hour
│  └─ Login Requests: Throttle to 1 per second per IP
│
├─ Session Management
│  ├─ JWT Token
│  │  ├─ Duration: 8 hours
│  │  ├─ Refresh Token: 30 days
│  │  ├─ Storage: httpOnly cookie (secure, sameSite=Strict)
│  │  ├─ Algorithm: HS256 or RS256
│  │  └─ Revocation: Blacklist on logout
│  │
│  ├─ Session Timeout
│  │  ├─ Inactivity: 1 hour
│  │  ├─ Warning: 50-minute mark with 10-minute countdown
│  │  └─ Auto-logout: On timeout expiration
│  │
│  └─ Cookie Security
│     ├─ Secure Flag: Yes (HTTPS only)
│     ├─ HttpOnly Flag: Yes (JavaScript cannot access)
│     ├─ SameSite: Strict
│     └─ Path: Specific to /api/auth
│
├─ OAuth Security
│  ├─ PKCE: Use for OAuth flows
│  ├─ State Parameter: Validate on callback
│  ├─ Nonce: Use for OpenID Connect
│  └─ Token Validation: Server-side verification
│
└─ Content Security Policy (CSP)
   ├─ Default-src: 'self'
   ├─ Script-src: 'self'
   ├─ Style-src: 'self' 'unsafe-inline'
   ├─ Img-src: 'self' https:
   ├─ Font-src: 'self'
   └─ Frame-ancestors: 'none'
```

---

[REST OF FRD CONTINUES WITH EXISTING CONTENT...]

## 2. SYSTEM OVERVIEW

### 2.1 Project Scope

This enhanced MVP establishes the foundational architecture for the UT Service Console with an integrated professional login interface plus two core operational modules.

**In Scope (Phase 1 — MVP):**
- Professional login page design (as detailed above)
- User authentication and session management
- Case creation, viewing, editing, and status tracking
- Work Order creation, viewing, and linking to Cases
- Three-column and two-column responsive layouts
- Basic SLA tracking and milestone pipeline
- Activity history and audit logging

**Out of Scope (Phase 1):**
- SAP integration (scheduled for Phase 2)
- EMR/OO integrations (Phase 2+)
- Advanced analytics and reporting
- Mobile app (future phase)
- Multi-tenancy (future phase)

### 2.2 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React/HTML5/CSS3 | Login page + UI rendering |
| **Backend** | ASP.NET Core 8.0 | API server, business logic |
| **Database** | MySQL Server | Data persistence via SSMS |
| **ORM** | Entity Framework Core | Database abstraction |
| **Authentication** | JWT + OAuth2 | Token-based auth + social login |
| **API Style** | RESTful (JSON) | Client-server communication |

### 2.3 Target Users

- **Service Advisors** — Case creation, assignment, monitoring
- **Field Mechanics** — Work Order execution, time tracking
- **Case Managers** — SLA oversight, case closure
- **Administrators** — System configuration and user management

---

## 3. LOGIN MODULE (ENHANCED)

### 3.1 Authentication Flow

**FR-LOGIN-001: User Credential Validation (Updated with UI)**
- System shall accept username/email and password via form
- Form displays email field with icon and validation
- Password field includes show/hide toggle
- System validates credentials against Users table
- System enforces password minimum requirements
- Error messages display below respective form fields
- Loading state shows spinner during submission

**FR-LOGIN-002: OAuth Authentication (New)**
- System provides UT Account OAuth button
- System provides Microsoft OAuth button
- OAuth buttons styled and positioned in dedicated section
- Social login redirects to respective OAuth providers
- PKCE flow used for security
- User created or updated upon successful OAuth

**FR-LOGIN-003: Form Validation**
- Email format validation (real-time on blur)
- Password required validation
- Error messages display inline below fields
- Success state shows checkmark and redirects
- Loading spinner shown during form submission
- Button disabled during submission

**FR-LOGIN-004: Session & Token Management**
- JWT token generated upon successful authentication
- Token stored in httpOnly secure cookie
- Session timeout after 1 hour of inactivity
- Warning dialog shown at 50-minute mark
- User can extend session or log out
- Refresh token valid for 30 days

**FR-LOGIN-005: Account Lockout Policy**
- Account locks after 5 failed login attempts
- Lockout duration: 30 minutes
- Error message shows lockout message with timestamp
- Admin can manually unlock accounts

---

## 4. CASE MANAGEMENT MODULE

[Content remains same as original FRD...]

## 5. WORK ORDER MODULE

[Content remains same as original FRD...]

## 6. DATABASE FRAMEWORK

[Content remains same as original FRD...]

## 7. API SPECIFICATIONS

[Content remains same as original FRD...]

## 8. UI/UX FLOW

### 8.1 Login Flow (Enhanced)

```
1. User navigates to /login
   ↓
2. Display login page with professional design
   ├─ Left panel: Login form
   ├─ Right panel: Background image with overlay
   ├─ Responsive layout (adapts to screen size)
   └─ Accessibility features enabled
   ↓
3. User enters email and password
   ├─ Real-time validation on blur
   ├─ Error messages display inline
   ├─ Show/hide toggle for password
   └─ Remember me checkbox available
   ↓
4a. User clicks LOGIN button
    ├─ Show loading spinner
    ├─ Disable form fields
    ├─ Send POST /api/auth/login
    ├─ Server validates credentials
    │
    ├─ Success: 
    │  ├─ Show success state (green, checkmark)
    │  ├─ Store JWT token
    │  ├─ Redirect to /console
    │  └─ Load dashboard
    │
    └─ Failure:
       ├─ Show error state (red, shake)
       ├─ Display error message below password
       ├─ Re-enable form
       └─ Suggest forgot password or sign up
       
4b. User clicks OAuth button
    ├─ Redirect to OAuth provider
    ├─ User authenticates with provider
    ├─ Provider redirects back with auth code
    ├─ System exchanges code for token
    ├─ Create or update user account
    ├─ Generate JWT token
    └─ Redirect to /console

5. User forgot password
   ├─ Click "Forgot password?" link
   ├─ Navigate to /forgot-password
   ├─ Enter email address
   ├─ Receive reset link via email
   └─ Reset password via secure link
```

---

## 9. NON-FUNCTIONAL REQUIREMENTS

### 9.1 Performance

- **Login Page Load Time:** < 1.5 seconds (including images)
- **Form Submission:** < 1 second response from server
- **OAuth Redirect:** < 2 seconds total
- **Image Optimization:** Compressed to < 200KB
- **Lazy Loading:** Background image loads asynchronously

### 9.2 Security

- **HTTPS Only:** All communication encrypted
- **Password Policy:** 8+ chars, uppercase, number, special char
- **Account Lockout:** After 5 failed attempts (30 min lockout)
- **Rate Limiting:** Max 5 failed logins per 15 min per IP
- **CSRF Protection:** Token validation on form submission
- **OAuth:** PKCE flow + state parameter validation
- **Password Storage:** Bcrypt hashing with salt

### 9.3 Usability

- **Responsive Design:** Mobile, tablet, desktop support
- **Accessibility:** WCAG 2.1 AA compliance
- **Touch-friendly:** 44px minimum button sizes
- **Keyboard Navigation:** Full support
- **Error Messages:** Clear, actionable text
- **Form Feedback:** Real-time validation

### 9.4 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 10. IMPLEMENTATION NOTES

### 10.1 Frontend (React/HTML)

1. Create login page component
2. Implement form validation logic
3. Add CSS styling (dark theme)
4. Create responsive layout
5. Implement OAuth integration
6. Add accessibility features
7. Optimize image loading

### 10.2 Backend (ASP.NET Core)

1. Implement login endpoint
2. Add OAuth handlers
3. Create JWT token generation
4. Implement session management
5. Add rate limiting
6. Setup account lockout
7. Configure HTTPS/CORS

---

**Document Version:** 1.1 (Enhanced with Login Design)  
**Status:** Complete with Login Page Specifications  
**Ready for:** Frontend + Backend Implementation

