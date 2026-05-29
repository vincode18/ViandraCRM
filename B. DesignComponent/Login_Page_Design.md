# UT Service Console - Login Page Design

## Professional Login Interface with OAuth Authentication

---

## 1. LOGIN PAGE OVERVIEW

### 1.1 Page Purpose & User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE - LOGIN PAGE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ENTRY POINT:                                                    │
│ ├─ New user visiting system                                     │
│ ├─ Session expired                                              │
│ ├─ User logged out                                              │
│ └─ Direct URL access to /login                                  │
│                                                                  │
│ USER GOALS:                                                      │
│ ├─ Quick login with email/password                              │
│ ├─ Fast OAuth login (UT or Microsoft)                           │
│ ├─ Password recovery                                            │
│ └─ Account creation (Sign up)                                   │
│                                                                  │
│ SECURITY FEATURES:                                              │
│ ├─ Email verification                                           │
│ ├─ Password encryption                                          │
│ ├─ 2FA optional                                                 │
│ ├─ Rate limiting                                                │
│ └─ Session management                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. LOGIN PAGE - COMPLETE LAYOUT

### 2.1 Full Page ASCII Design

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  LEFT SIDE (45%) - LOGIN FORM        │  RIGHT SIDE (55%) - BACKGROUND     │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                      │                                     │
│  ┌────────────────────────────────┐ │ ┌───────────────────────────────┐  │
│  │                                │ │ │                                 │  │
│  │  🏗️ UT SERVICE CONSOLE         │ │ │  [EXCAVATOR/HEAVY MACHINE IMG] │  │
│  │  Logo                          │ │ │                                 │  │
│  │                                │ │ │  Background Image:              │  │
│  │                                │ │ │  ├─ Equipment photo            │  │
│  │  ────────────────────────────  │ │ │  ├─ Size: 100% width & height │  │
│  │                                │ │ │  ├─ Overlay: Dark gradient     │  │
│  │  HEADLINE:                     │ │ │  ├─ Opacity: 0.3-0.4          │  │
│  │  "Login to your account"       │ │ │  └─ Position: Cover            │  │
│  │                                │ │ │                                 │  │
│  │  Subtitle:                     │ │ │  [Optional Company Info/Tagline]  │
│  │  "Enter your email below to    │ │ │  "Trusted by Equipment Rental"   │  │
│  │   login to your account"       │ │ │  "Services Across Indonesia"     │  │
│  │                                │ │ │                                 │  │
│  ├────────────────────────────────┤ │ │                                 │  │
│  │ FORM SECTION:                  │ │ │                                 │  │
│  │ ─────────────────────────────  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ Email *                        │ │ │                                 │  │
│  │ ┌──────────────────────────┐  │ │ │                                 │  │
│  │ │ m@example.com            │  │ │ │                                 │  │
│  │ └──────────────────────────┘  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ Password *                     │ │ │                                 │  │
│  │ ┌──────────────────────────┐  │ │ │                                 │  │
│  │ │ ••••••••••••••••••        │  │ │ │                                 │  │
│  │ │            [Show/Hide 👁️] │  │ │ │                                 │  │
│  │ └──────────────────────────┘  │ │ │                                 │  │
│  │                 [Forgot?]      │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ Remember me ☑                  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ ┌──────────────────────────┐  │ │ │                                 │  │
│  │ │ [LOGIN]                  │  │ │ │                                 │  │
│  │ │ (Primary Button - Blue)  │  │ │ │                                 │  │
│  │ └──────────────────────────┘  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  ├────────────────────────────────┤ │ │                                 │  │
│  │ OAUTH SECTION:                 │ │ │                                 │  │
│  │ ─────────────────────────────  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ Or continue with:              │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ ┌──────────────────────────┐  │ │ │                                 │  │
│  │ │ 🔒 UT SERVICE ACCOUNT    │  │ │ │                                 │  │
│  │ │ Login with UT Account    │  │ │ │                                 │  │
│  │ └──────────────────────────┘  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ ┌──────────────────────────┐  │ │ │                                 │  │
│  │ │ 🪟 MICROSOFT ACCOUNT     │  │ │ │                                 │  │
│  │ │ Login with Microsoft     │  │ │ │                                 │  │
│  │ └──────────────────────────┘  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  ├────────────────────────────────┤ │ │                                 │  │
│  │ FOOTER LINKS:                  │ │ │                                 │  │
│  │ ─────────────────────────────  │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ Don't have an account?         │ │ │                                 │  │
│  │ [Sign up here]                 │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  │ [Terms of Service] | [Privacy] │ │ │                                 │  │
│  │ [Contact Support] | [Help]     │ │ │                                 │  │
│  │                                │ │ │                                 │  │
│  └────────────────────────────────┘ │ │                                 │  │
│                                      │ │                                 │  │
│  DARK THEME (Dark Mode):             │ │ Logo/Watermark:                │  │
│  ├─ Background: #1a1a1a              │ │ "Acme Inc." or Company Name  │  │
│  ├─ Text: #ffffff                    │ │ (Shown on right side)          │  │
│  ├─ Inputs: #2a2a2a                  │ │                                 │  │
│  ├─ Borders: #3a3a3a                 │ │ Footer Text:                    │  │
│  ├─ Primary Button: #007bff          │ │ "Copyright © 2026"              │  │
│  ├─ Secondary Button: #444444        │ │ "Privacy Policy"                │  │
│  └─ Links: #4a9eff                   │ │                                 │  │
│                                      │ └───────────────────────────────┘  │
│                                      │                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. LEFT SIDE - LOGIN FORM DETAILED

### 3.1 Header & Branding

```
┌────────────────────────────────────┐
│                                    │
│  [LOGO] UT SERVICE CONSOLE         │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  Login to your account             │
│                                    │
│  Enter your email below to login   │
│  to your account                   │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  LOGO SPECIFICATIONS:              │
│  ├─ Size: 40x40px or larger       │
│  ├─ Color: #ffffff (white)         │
│  ├─ Spacing: 20px below logo      │
│  └─ Font: Bold, 24px               │
│                                    │
│  HEADLINE:                         │
│  ├─ Font: 28px, bold               │
│  ├─ Color: #ffffff                 │
│  └─ Margin: 20px bottom            │
│                                    │
│  SUBTITLE:                         │
│  ├─ Font: 14px, regular            │
│  ├─ Color: #b0b0b0                 │
│  └─ Margin: 10px bottom            │
│                                    │
└────────────────────────────────────┘
```

### 3.2 Email Field

```
┌────────────────────────────────────┐
│ Email *                            │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ m@example.com                │  │
│ │                              │  │
│ │ Placeholder: "m@example.com" │  │
│ │ Icon: 📧 Email icon (left)   │  │
│ │ Type: email                  │  │
│ │ Required: YES                │  │
│ │ Auto-complete: email         │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ STYLING:                           │
│ ├─ Background: #2a2a2a             │
│ ├─ Border: 1px #3a3a3a             │
│ ├─ Border-radius: 6px              │
│ ├─ Padding: 12px 16px              │
│ ├─ Focus Border: #007bff           │
│ ├─ Font: 14px                      │
│ ├─ Height: 44px                    │
│ └─ Transition: 0.3s                │
│                                    │
│ VALIDATION:                        │
│ ├─ Required: true                  │
│ ├─ Format: Must be valid email     │
│ ├─ Error msg: "Invalid email"      │
│ └─ Success: Green checkmark        │
│                                    │
│ ACCESSIBILITY:                     │
│ ├─ Label for: "email"              │
│ ├─ aria-label: "Email address"     │
│ └─ aria-required: "true"           │
│                                    │
└────────────────────────────────────┘
```

### 3.3 Password Field

```
┌────────────────────────────────────┐
│ Password *                         │
│          [Forgot your password?]   │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ ••••••••••••••••••           │  │
│ │                [👁️ Show/Hide] │  │
│ │                              │  │
│ │ Placeholder: (dot-masked)    │  │
│ │ Icon: 🔒 Lock icon (left)    │  │
│ │ Type: password               │  │
│ │ Required: YES                │  │
│ │ Show/Hide: Toggle button     │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ STYLING:                           │
│ ├─ Background: #2a2a2a             │
│ ├─ Border: 1px #3a3a3a             │
│ ├─ Border-radius: 6px              │
│ ├─ Padding: 12px 16px              │
│ ├─ Focus Border: #007bff           │
│ ├─ Font: 14px (monospace optional) │
│ ├─ Height: 44px                    │
│ └─ Transition: 0.3s                │
│                                    │
│ FORGOT PASSWORD LINK:              │
│ ├─ Position: Right aligned         │
│ ├─ Font: 12px                      │
│ ├─ Color: #4a9eff                  │
│ ├─ Hover: Underline                │
│ └─ Action: Go to /forgot-password  │
│                                    │
│ SHOW/HIDE TOGGLE:                  │
│ ├─ Icon: 👁️ / 🚫 (eye/blocked eye)│
│ ├─ Position: Right side of input   │
│ ├─ Cursor: pointer                 │
│ └─ Click: Toggle password visibility
│                                    │
│ VALIDATION:                        │
│ ├─ Required: true                  │
│ ├─ Min length: 6 characters        │
│ ├─ Error msg: "Password too short" │
│ └─ Strength indicator: Optional    │
│                                    │
└────────────────────────────────────┘
```

### 3.4 Remember Me & Login Button

```
┌────────────────────────────────────┐
│ Remember me                        │
│ ☑ Keep me logged in                │
│                                    │
│ CHECKBOX STYLING:                  │
│ ├─ Size: 16x16px                   │
│ ├─ Color checked: #007bff          │
│ ├─ Label font: 13px                │
│ ├─ Label color: #e0e0e0            │
│ └─ Margin: 10px bottom             │
│                                    │
│ ════════════════════════════════   │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ LOGIN                        │  │
│ │ (Primary Button)             │  │
│ │                              │  │
│ │ Background: #007bff          │  │
│ │ Hover: #0056b3               │  │
│ │ Active: #003d82              │  │
│ │ Disabled: #4a4a4a            │  │
│ │ Text: white                  │  │
│ │ Font: bold 14px              │  │
│ │ Height: 44px                 │  │
│ │ Border-radius: 6px           │  │
│ │ Transition: 0.3s             │  │
│ │ Cursor: pointer              │  │
│ │ Loading: Spinner icon        │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ BUTTON STATES:                     │
│ ├─ Normal: Blue background         │
│ ├─ Hover: Darker blue              │
│ ├─ Active: Even darker             │
│ ├─ Loading: Spinner + "Logging in"│
│ ├─ Disabled: Gray                  │
│ └─ Error: Red background           │
│                                    │
│ BUTTON ACTIONS:                    │
│ ├─ Validate email format           │
│ ├─ Validate password not empty     │
│ ├─ Send login request              │
│ ├─ Show loading spinner            │
│ ├─ Redirect on success             │
│ └─ Show error on failure           │
│                                    │
└────────────────────────────────────┘
```

---

## 4. OAUTH SECTION - SOCIAL LOGIN

### 4.1 OAuth Divider & Section

```
┌────────────────────────────────────┐
│                                    │
│        ─────────────────────       │
│        Or continue with            │
│        ─────────────────────       │
│                                    │
│ DIVIDER STYLING:                   │
│ ├─ Line color: #3a3a3a             │
│ ├─ Text color: #b0b0b0             │
│ ├─ Font size: 13px                 │
│ ├─ Margin: 20px 0                  │
│ └─ Display: flex with lines        │
│                                    │
└────────────────────────────────────┘
```

### 4.2 UT Service Account Login

```
┌────────────────────────────────────┐
│ UT SERVICE ACCOUNT LOGIN           │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ [🔒] LOGIN WITH UT ACCOUNT   │  │
│ │                              │  │
│ │ Icon: 🔒 Security/Shield     │  │
│ │ Label: "LOGIN WITH UT"       │  │
│ │ Background: #2a5a8f          │  │
│ │ Hover: #1f4670               │  │
│ │ Border: 1px #3a7aaf          │  │
│ │ Text: white                  │  │
│ │ Font: 13px bold              │  │
│ │ Padding: 12px 16px           │  │
│ │ Height: 44px                 │  │
│ │ Border-radius: 6px           │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ ON CLICK ACTION:                   │
│ ├─ Redirect to: /auth/ut-login    │
│ ├─ OAuth provider: UT Internal     │
│ ├─ Scope: email profile openid    │
│ └─ Return to: /dashboard          │
│                                    │
│ UT LOGIN FLOW:                     │
│ ├─ User clicks button             │
│ ├─ Redirects to UT OAuth server   │
│ ├─ User enters UT credentials     │
│ ├─ Server validates & returns JWT │
│ ├─ App stores token               │
│ └─ Redirects to dashboard         │
│                                    │
│ BENEFITS:                          │
│ ├─ Fast single sign-on            │
│ ├─ Secure OAuth 2.0               │
│ ├─ Company-wide authentication    │
│ └─ Integrated with UT Directory   │
│                                    │
│ REQUIRES:                          │
│ ├─ UT Service Account             │
│ ├─ Company email domain           │
│ └─ OAuth configured in admin      │
│                                    │
└────────────────────────────────────┘
```

### 4.3 Microsoft Account Login

```
┌────────────────────────────────────┐
│ MICROSOFT ACCOUNT LOGIN            │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ [🪟] LOGIN WITH MICROSOFT    │  │
│ │                              │  │
│ │ Icon: 🪟 Windows/Office icon │  │
│ │ Label: "LOGIN WITH MICROSOFT"│  │
│ │ Background: #0078d4          │  │
│ │ Hover: #005a9e               │  │
│ │ Border: 1px #0084c6          │  │
│ │ Text: white                  │  │
│ │ Font: 13px bold              │  │
│ │ Padding: 12px 16px           │  │
│ │ Height: 44px                 │  │
│ │ Border-radius: 6px           │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ ON CLICK ACTION:                   │
│ ├─ Redirect to: /auth/microsoft   │
│ ├─ OAuth provider: Microsoft      │
│ ├─ Scope: email profile openid   │
│ └─ Return to: /dashboard          │
│                                    │
│ MICROSOFT LOGIN FLOW:              │
│ ├─ User clicks button             │
│ ├─ Redirects to Microsoft login   │
│ ├─ User enters MS credentials     │
│ ├─ Multi-factor auth (if enabled) │
│ ├─ Server validates & returns JWT │
│ ├─ App stores token               │
│ └─ Redirects to dashboard         │
│                                    │
│ BENEFITS:                          │
│ ├─ Single sign-on with MS account │
│ ├─ Microsoft 365 integration      │
│ ├─ Enterprise security            │
│ ├─ Conditional Access             │
│ └─ Device compliance checking     │
│                                    │
│ SUPPORTS:                          │
│ ├─ Personal Microsoft accounts    │
│ ├─ Work/School accounts           │
│ ├─ Azure AD accounts              │
│ └─ Multi-tenant scenarios         │
│                                    │
│ REQUIRES:                          │
│ ├─ Microsoft account              │
│ ├─ OAuth2.0 configured           │
│ └─ Azure AD setup (optional)      │
│                                    │
└────────────────────────────────────┘
```

### 4.4 OAuth Button Comparison

```
┌──────────────────────────────────────────────┐
│ OAUTH BUTTON SPECIFICATIONS                  │
├──────────────────────────────────────────────┤
│                                              │
│ BUTTON 1: UT SERVICE ACCOUNT                 │
│ ├─ Icon: 🔒 (Shield/Lock)                   │
│ ├─ Color: #2a5a8f (Dark Blue)               │
│ ├─ Provider: Internal UT                     │
│ └─ Use Case: Company employees              │
│                                              │
│ BUTTON 2: MICROSOFT ACCOUNT                  │
│ ├─ Icon: 🪟 (Windows/Fluent)                │
│ ├─ Color: #0078d4 (Microsoft Blue)          │
│ ├─ Provider: External Microsoft              │
│ └─ Use Case: Enterprise/M365 users          │
│                                              │
│ SHARED STYLING:                              │
│ ├─ Width: 100%                               │
│ ├─ Height: 44px                              │
│ ├─ Spacing: 10px between buttons             │
│ ├─ Border-radius: 6px                        │
│ ├─ Font: 13px bold                           │
│ ├─ Icon size: 18px                           │
│ ├─ Icon margin: 0 8px 0 0                    │
│ ├─ Transition: 0.3s ease                     │
│ └─ Box-shadow: 0 2px 4px rgba(0,0,0,0.1)   │
│                                              │
│ HOVER EFFECTS:                               │
│ ├─ UT Button Hover: #1f4670                  │
│ ├─ Microsoft Button Hover: #005a9e           │
│ ├─ Scale: 1.02 (slight zoom)                 │
│ └─ Shadow: 0 4px 8px rgba(0,0,0,0.2)       │
│                                              │
│ ACTIVE STATE:                                │
│ ├─ Background: Darker shade                  │
│ ├─ Scale: 0.98 (slight press)                │
│ └─ Shadow: Minimal                           │
│                                              │
│ DISABLED STATE:                              │
│ ├─ Background: #4a4a4a (gray)                │
│ ├─ Opacity: 0.5                              │
│ ├─ Cursor: not-allowed                       │
│ └─ Pointer-events: none                      │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 5. RIGHT SIDE - BACKGROUND IMAGE & BRANDING

### 5.1 Background Image Section

```
┌───────────────────────────────────────────┐
│                                            │
│  BACKGROUND IMAGE SPECIFICATION:          │
│                                            │
│  Image Type: Equipment/Excavator/Grader   │
│  Format: JPG / PNG / WebP                 │
│  Resolution: 1080x1440px (minimum)        │
│  Aspect Ratio: ~16:9 or portrait          │
│  File Size: <500KB (optimized)            │
│                                            │
│  POSITIONING:                              │
│  ├─ Position: Right side (55% width)      │
│  ├─ Object-fit: cover                     │
│  ├─ Background-size: cover                │
│  ├─ Background-position: center           │
│  └─ Repeat: no-repeat                     │
│                                            │
│  IMAGE CHARACTERISTICS:                   │
│  ├─ Subject: Heavy machinery              │
│  ├─ Equipment: Excavator/Grader/Dozer    │
│  ├─ Condition: Professional quality       │
│  ├─ Angle: 3/4 view or side profile       │
│  ├─ Lighting: Good visibility             │
│  ├─ Background: Neutral/construction site │
│  └─ Color: Yellow/Orange heavy machinery  │
│                                            │
│  OVERLAY EFFECT:                           │
│  ├─ Type: Dark gradient                   │
│  ├─ Direction: Left to right              │
│  ├─ Colors: rgba(0,0,0,0.4) → transparent│
│  ├─ Opacity: 0.3 - 0.4                    │
│  └─ Purpose: Readable login form          │
│                                            │
│  RESPONSIVE:                               │
│  ├─ Desktop (>1024px): Show background   │
│  ├─ Tablet (768px-1024px): Show reduced  │
│  ├─ Mobile (<768px): Hide background     │
│  └─ Dark mode: Auto-adjust opacity       │
│                                            │
│  ACCESSIBILITY:                            │
│  ├─ Alt text: Descriptive                 │
│  ├─ Contrast: High for readability        │
│  ├─ No critical info in image             │
│  └─ WCAG 2.1 compliant                    │
│                                            │
└───────────────────────────────────────────┘
```

### 5.2 Company Branding & Footer

```
┌───────────────────────────────────────────┐
│ COMPANY INFORMATION (Right Side)          │
│                                            │
│ LOGO/NAME (Top-right corner):             │
│ ┌─────────────────────────────────────┐  │
│ │ ACME INC.                           │  │
│ │ (or Company Name)                   │  │
│ │                                     │  │
│ │ Font: 16px bold                     │  │
│ │ Color: rgba(255,255,255,0.9)        │  │
│ │ Position: Top-right, 20px margin    │  │
│ │ Background: rgba(0,0,0,0.3)         │  │
│ │ Padding: 8px 12px                   │  │
│ │ Border-radius: 4px                  │  │
│ └─────────────────────────────────────┘  │
│                                            │
│ TAGLINE (Center):                         │
│ ┌─────────────────────────────────────┐  │
│ │ "Trusted Equipment Rental Services" │  │
│ │                                     │  │
│ │ "Serving Indonesia Since 1990"      │  │
│ │                                     │  │
│ │ Font: 14px                          │  │
│ │ Color: rgba(255,255,255,0.8)        │  │
│ │ Text-align: center                  │  │
│ │ Position: Center vertically         │  │
│ │ Max-width: 300px                    │  │
│ └─────────────────────────────────────┘  │
│                                            │
│ FOOTER (Bottom-right):                    │
│ ┌─────────────────────────────────────┐  │
│ │ © 2026 Acme Inc. All Rights         │  │
│ │ Reserved                            │  │
│ │                                     │  │
│ │ Font: 12px                          │  │
│ │ Color: rgba(255,255,255,0.6)        │  │
│ │ Position: Bottom-right              │  │
│ │ Margin: 20px                        │  │
│ └─────────────────────────────────────┘  │
│                                            │
│ SOCIAL LINKS (Optional):                  │
│ ┌─────────────────────────────────────┐  │
│ │ [Website] [LinkedIn] [Facebook]     │  │
│ │                                     │  │
│ │ Color: rgba(255,255,255,0.7)        │  │
│ │ Hover: Full white                   │  │
│ │ Font: 12px                          │  │
│ │ Links spacing: 15px                 │  │
│ └─────────────────────────────────────┘  │
│                                            │
└───────────────────────────────────────────┘
```

---

## 6. BOTTOM SECTION - LINKS & FOOTER

### 6.1 Sign Up & Footer Links

```
┌────────────────────────────────────┐
│ SIGN UP SECTION:                   │
│                                    │
│ Don't have an account?             │
│ [Sign up here]                     │
│                                    │
│ STYLING:                           │
│ ├─ Text: 13px, color #b0b0b0      │
│ ├─ Link: #4a9eff, underlined       │
│ ├─ Link hover: Full white          │
│ ├─ Margin: 15px top                │
│ └─ Text-align: center              │
│                                    │
│ ACTION:                            │
│ └─ Click: Navigate to /sign-up    │
│                                    │
├────────────────────────────────────┤
│ FOOTER LINKS:                      │
│                                    │
│ [Terms of Service] | [Privacy]     │
│ [Contact Support] | [Help]         │
│                                    │
│ [Security] | [Status] | [System]   │
│                                    │
│ STYLING:                           │
│ ├─ Font: 12px                      │
│ ├─ Color: #888888                  │
│ ├─ Links: #4a9eff                  │
│ ├─ Divider: |                      │
│ ├─ Margin: 10px between            │
│ ├─ Spacing: 20px top               │
│ └─ Text-align: center              │
│                                    │
│ LINKS DESTINATIONS:                │
│ ├─ Terms: /terms                   │
│ ├─ Privacy: /privacy               │
│ ├─ Contact: /contact               │
│ ├─ Help: /help                     │
│ ├─ Security: /security             │
│ ├─ Status: status.company.com      │
│ └─ System: /system-status          │
│                                    │
│ ACCESSIBILITY:                     │
│ ├─ Keyboard navigation: Tab access │
│ ├─ Focus indicator: Visible        │
│ ├─ WCAG 2.1: Level AA              │
│ └─ Screen reader: Labeled          │
│                                    │
└────────────────────────────────────┘
```

---

## 7. COLOR SCHEME & DARK THEME

### 7.1 Complete Color Palette

```
┌──────────────────────────────────────────────┐
│ LOGIN PAGE COLOR SCHEME                      │
├──────────────────────────────────────────────┤
│                                              │
│ BACKGROUND COLORS:                           │
│ ├─ Main BG: #1a1a1a (dark black)             │
│ ├─ Secondary: #2a2a2a (input fields)         │
│ ├─ Overlay: rgba(0, 0, 0, 0.3-0.4)          │
│ └─ Hover overlay: rgba(0, 0, 0, 0.2)        │
│                                              │
│ TEXT COLORS:                                 │
│ ├─ Primary text: #ffffff (white)             │
│ ├─ Secondary text: #e0e0e0 (light gray)      │
│ ├─ Muted text: #b0b0b0 (medium gray)         │
│ ├─ Disabled text: #666666 (dark gray)        │
│ └─ Error text: #ff6b6b (red)                 │
│                                              │
│ INTERACTIVE COLORS:                          │
│ ├─ Primary button: #007bff (blue)            │
│ ├─ UT OAuth button: #2a5a8f (dark blue)      │
│ ├─ Microsoft button: #0078d4 (Microsoft blue)│
│ ├─ Links: #4a9eff (bright blue)              │
│ ├─ Hover links: #ffffff (white)              │
│ ├─ Focus outline: #4a9eff (blue)             │
│ └─ Error states: #ff6b6b (red)               │
│                                              │
│ BORDER COLORS:                               │
│ ├─ Default border: #3a3a3a (dark)            │
│ ├─ Focus border: #007bff (blue)              │
│ ├─ Error border: #ff6b6b (red)               │
│ └─ Success border: #28a745 (green)           │
│                                              │
│ STATUS COLORS:                               │
│ ├─ Success: #28a745 (green)                  │
│ ├─ Error: #ff6b6b (red)                      │
│ ├─ Warning: #ffc107 (yellow)                 │
│ └─ Info: #17a2b8 (cyan)                      │
│                                              │
│ TRANSPARENCY VALUES:                         │
│ ├─ Full opacity: 1.0                         │
│ ├─ High opacity: 0.9                         │
│ ├─ Medium opacity: 0.5-0.6                   │
│ ├─ Low opacity: 0.3-0.4                      │
│ └─ Disabled opacity: 0.5                     │
│                                              │
│ CSS VARIABLES:                               │
│ ├─ --color-bg: #1a1a1a                       │
│ ├─ --color-bg-secondary: #2a2a2a             │
│ ├─ --color-text: #ffffff                     │
│ ├─ --color-text-muted: #b0b0b0               │
│ ├─ --color-primary: #007bff                  │
│ ├─ --color-error: #ff6b6b                    │
│ └─ --color-border: #3a3a3a                   │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 8. TYPOGRAPHY & FONTS

### 8.1 Font Specifications

```
┌──────────────────────────────────────────────┐
│ TYPOGRAPHY SYSTEM                            │
├──────────────────────────────────────────────┤
│                                              │
│ FONT FAMILY:                                 │
│ Primary: 'Segoe UI', 'Roboto', sans-serif   │
│ Fallback: system fonts, -apple-system       │
│ Code: 'Courier New', monospace              │
│                                              │
│ LOGO & BRANDING:                             │
│ ├─ Font: Bold                                │
│ ├─ Size: 24px                                │
│ ├─ Line-height: 1.2                          │
│ ├─ Letter-spacing: 0.5px                     │
│ └─ Color: #ffffff                            │
│                                              │
│ MAIN HEADLINE:                               │
│ ├─ Font: Bold                                │
│ ├─ Size: 28px                                │
│ ├─ Line-height: 1.3                          │
│ ├─ Letter-spacing: normal                    │
│ ├─ Color: #ffffff                            │
│ └─ Weight: 600                               │
│                                              │
│ SUBTITLE:                                    │
│ ├─ Font: Regular                             │
│ ├─ Size: 14px                                │
│ ├─ Line-height: 1.5                          │
│ ├─ Letter-spacing: normal                    │
│ ├─ Color: #b0b0b0                            │
│ └─ Weight: 400                               │
│                                              │
│ FORM LABELS:                                 │
│ ├─ Font: Regular                             │
│ ├─ Size: 13px                                │
│ ├─ Line-height: 1.4                          │
│ ├─ Letter-spacing: normal                    │
│ ├─ Color: #e0e0e0                            │
│ └─ Weight: 500                               │
│                                              │
│ INPUT TEXT:                                  │
│ ├─ Font: Regular                             │
│ ├─ Size: 14px                                │
│ ├─ Line-height: 1.5                          │
│ ├─ Letter-spacing: normal                    │
│ ├─ Color: #ffffff                            │
│ └─ Weight: 400                               │
│                                              │
│ BUTTON TEXT:                                 │
│ ├─ Font: Bold                                │
│ ├─ Size: 13px-14px                           │
│ ├─ Line-height: 1.4                          │
│ ├─ Letter-spacing: 0.5px                     │
│ ├─ Color: #ffffff                            │
│ └─ Weight: 600                               │
│                                              │
│ SMALL TEXT (Links, Footer):                  │
│ ├─ Font: Regular                             │
│ ├─ Size: 12px                                │
│ ├─ Line-height: 1.4                          │
│ ├─ Letter-spacing: normal                    │
│ ├─ Color: #888888                            │
│ └─ Weight: 400                               │
│                                              │
├──────────────────────────────────────────────┤
│ RESPONSIVE TYPOGRAPHY:                       │
│                                              │
│ Desktop (>1024px):                           │
│ ├─ Logo: 24px                                │
│ ├─ Headline: 28px                            │
│ └─ Subtitle: 14px                            │
│                                              │
│ Tablet (768px-1024px):                       │
│ ├─ Logo: 20px                                │
│ ├─ Headline: 24px                            │
│ └─ Subtitle: 13px                            │
│                                              │
│ Mobile (<768px):                             │
│ ├─ Logo: 18px                                │
│ ├─ Headline: 22px                            │
│ └─ Subtitle: 12px                            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 9. RESPONSIVE DESIGN

### 9.1 Device Breakpoints

```
┌──────────────────────────────────────────────────────┐
│ RESPONSIVE LAYOUTS                                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ DESKTOP (1440px+):                                   │
│ ├─ Left panel: 45% (form)                           │
│ ├─ Right panel: 55% (background image)              │
│ ├─ Max-width form: 450px                            │
│ ├─ Background: Full size                            │
│ └─ Layout: Side-by-side                             │
│                                                      │
│ LAPTOP (1024px - 1440px):                            │
│ ├─ Left panel: 50%                                  │
│ ├─ Right panel: 50%                                 │
│ ├─ Max-width form: 400px                            │
│ ├─ Background: Scaled                               │
│ └─ Layout: Side-by-side (narrower)                  │
│                                                      │
│ TABLET LANDSCAPE (900px - 1024px):                   │
│ ├─ Left panel: 55%                                  │
│ ├─ Right panel: 45% (reduced image)                 │
│ ├─ Max-width form: 380px                            │
│ ├─ Background: Show with higher opacity             │
│ └─ Layout: Side-by-side (compact)                   │
│                                                      │
│ TABLET PORTRAIT (768px - 900px):                     │
│ ├─ Left panel: 100%                                 │
│ ├─ Right panel: 0% (hidden)                         │
│ ├─ Max-width form: 360px                            │
│ ├─ Centered: Yes                                    │
│ └─ Layout: Full-width form                          │
│                                                      │
│ MOBILE LANDSCAPE (600px - 768px):                    │
│ ├─ Layout: Full-width form                          │
│ ├─ Max-width form: 100% - 40px padding              │
│ ├─ Logo size: 18px                                  │
│ ├─ Headline: 22px                                   │
│ └─ Input height: 40px (thumb-friendly)              │
│                                                      │
│ MOBILE PORTRAIT (<600px):                            │
│ ├─ Layout: Full-width form                          │
│ ├─ Max-width form: 100% - 20px padding              │
│ ├─ Logo size: 16px                                  │
│ ├─ Headline: 20px                                   │
│ ├─ Input height: 44px (touch target)                │
│ ├─ Button spacing: 15px                             │
│ └─ Padding: 20px                                    │
│                                                      │
│ CSS MEDIA QUERIES:                                   │
│ ├─ @media (max-width: 768px) { hide background }   │
│ ├─ @media (max-width: 900px) { adjust layout }      │
│ ├─ @media (max-width: 600px) { mobile optimized }   │
│ └─ @media (prefers-color-scheme: light) { adjust }  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 10. ACCESSIBILITY & SECURITY

### 10.1 Accessibility Features

```
┌──────────────────────────────────────────────┐
│ WCAG 2.1 COMPLIANCE (Level AA)                │
├──────────────────────────────────────────────┤
│                                              │
│ KEYBOARD NAVIGATION:                         │
│ ├─ Tab: Move between fields                  │
│ ├─ Shift+Tab: Move backward                  │
│ ├─ Enter: Submit form                        │
│ ├─ Space: Toggle checkbox                    │
│ └─ Escape: Close modals                      │
│                                              │
│ SCREEN READER SUPPORT:                       │
│ ├─ All buttons have aria-labels              │
│ ├─ Form fields have associated labels        │
│ ├─ Required fields marked with aria-required │
│ ├─ Error messages announced                  │
│ └─ Landmark regions defined                  │
│                                              │
│ COLOR CONTRAST:                              │
│ ├─ Text vs background: 4.5:1 ratio           │
│ ├─ Button labels: 4.5:1 ratio                │
│ ├─ Links: 4.5:1 ratio                        │
│ └─ AAA compliant (7:1 preferred)              │
│                                              │
│ FOCUS INDICATORS:                            │
│ ├─ Visible on all interactive elements       │
│ ├─ Color: #4a9eff (blue outline)             │
│ ├─ Width: 2px                                │
│ └─ Offset: 2px                               │
│                                              │
│ ERROR HANDLING:                              │
│ ├─ Errors announced to screen readers        │
│ ├─ Field highlighted with red border         │
│ ├─ Error message in aria-describedby         │
│ └─ Validation on blur + submit               │
│                                              │
│ MOBILE ACCESSIBILITY:                        │
│ ├─ Touch targets: 44x44px minimum            │
│ ├─ Input fields: 40-44px height              │
│ ├─ Spacing: 10px between touchable items     │
│ └─ Font size: 16px (prevents zoom on iOS)    │
│                                              │
├──────────────────────────────────────────────┤
│ DARK MODE SUPPORT:                           │
│                                              │
│ prefers-color-scheme: dark (default)         │
│ @media (prefers-color-scheme: light)         │
│ ├─ Invert colors for light theme             │
│ ├─ Adjust background to light               │
│ ├─ Keep same contrast ratios                 │
│ └─ User preference respected                 │
│                                              │
└──────────────────────────────────────────────┘
```

### 10.2 Security Features

```
┌──────────────────────────────────────────────┐
│ LOGIN SECURITY                               │
├──────────────────────────────────────────────┤
│                                              │
│ PASSWORD HANDLING:                           │
│ ├─ Never sent as plain text                  │
│ ├─ HTTPS encryption (TLS 1.2+)               │
│ ├─ Hashed with bcrypt/Argon2                 │
│ ├─ Salted password storage                   │
│ └─ Never logged or displayed                 │
│                                              │
│ SESSION SECURITY:                            │
│ ├─ JWT tokens (JSON Web Tokens)              │
│ ├─ httpOnly cookies                          │
│ ├─ Secure flag on cookies                    │
│ ├─ SameSite attribute: Strict                │
│ ├─ Token expiration: 1 hour                  │
│ ├─ Refresh token: 30 days                    │
│ └─ Revocation on logout                      │
│                                              │
│ OAUTH SECURITY:                              │
│ ├─ PKCE flow (for mobile)                    │
│ ├─ State parameter verification              │
│ ├─ Nonce validation                          │
│ ├─ Scope restrictions                        │
│ └─ Token validation on backend               │
│                                              │
│ BRUTE FORCE PROTECTION:                      │
│ ├─ Rate limiting: 5 attempts / 15 mins       │
│ ├─ Progressive delays after failed attempts  │
│ ├─ Account lockout after 10 attempts         │
│ ├─ IP-based throttling                       │
│ └─ CAPTCHA on suspicious activity            │
│                                              │
│ CSRF PROTECTION:                             │
│ ├─ CSRF tokens on login form                 │
│ ├─ Token validation on POST                  │
│ ├─ SameSite cookies                          │
│ └─ Origin validation                         │
│                                              │
│ INPUT VALIDATION:                            │
│ ├─ Email format validation                   │
│ ├─ Max length enforcement                    │
│ ├─ Character whitelist                       │
│ ├─ XSS prevention (sanitization)             │
│ └─ SQL injection prevention (parameterized)  │
│                                              │
│ TWO-FACTOR AUTHENTICATION:                   │
│ ├─ TOTP (Time-based One-Time Password)       │
│ ├─ SMS/Email codes                           │
│ ├─ Optional but encouraged                   │
│ └─ Backup codes provided                     │
│                                              │
│ AUDIT LOGGING:                               │
│ ├─ Login attempts logged                     │
│ ├─ Failed attempts tracked                   │
│ ├─ IP address recorded                       │
│ ├─ User-agent captured                       │
│ └─ 90-day retention                          │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 11. ERROR STATES & FEEDBACK

### 11.1 Error Messages & Handling

```
┌────────────────────────────────────────┐
│ ERROR MESSAGE DISPLAY                  │
├────────────────────────────────────────┤
│                                        │
│ INVALID EMAIL:                         │
│ ┌──────────────────────────────────┐  │
│ │ ⚠️  Invalid email format          │  │
│ │    Please enter a valid email    │  │
│ │                                  │  │
│ │ Color: #ff6b6b (red)             │  │
│ │ Icon: ⚠️  Warning                 │  │
│ │ Font: 13px                       │  │
│ │ Margin: 5px top                  │  │
│ │ Animation: Fade in 0.3s          │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ INCORRECT PASSWORD:                    │
│ ┌──────────────────────────────────┐  │
│ │ ❌ Invalid credentials            │  │
│ │    The email or password you     │  │
│ │    entered is incorrect. Try     │  │
│ │    again.                        │  │
│ │                                  │  │
│ │ [Forgot your password?]          │  │
│ │                                  │  │
│ │ Color: #ff6b6b (red)             │  │
│ │ Type: Alert/Toast                │  │
│ │ Duration: 5 seconds              │  │
│ │ Action: Auto-dismiss or manual   │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ACCOUNT LOCKED:                        │
│ ┌──────────────────────────────────┐  │
│ │ 🔒 Account temporarily locked   │  │
│ │                                  │  │
│ │    Too many login attempts.      │  │
│ │    Try again in 15 minutes.      │  │
│ │                                  │  │
│ │ [Recover Account] [Contact Help] │  │
│ │                                  │  │
│ │ Color: #ffc107 (yellow/warning)  │  │
│ │ Type: Modal alert                │  │
│ │ Dismissible: No                  │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ NETWORK ERROR:                         │
│ ┌──────────────────────────────────┐  │
│ │ ⚠️  Network error                 │  │
│ │    Unable to connect. Check your │  │
│ │    connection and try again.     │  │
│ │                                  │  │
│ │ [Retry] [Offline Mode]           │  │
│ │                                  │  │
│ │ Color: #ff6b6b (red)             │  │
│ │ Type: Toast/Alert                │  │
│ │ Persistent: Until resolved       │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ SUCCESS MESSAGE:                       │
│ ┌──────────────────────────────────┐  │
│ │ ✓ Login successful               │  │
│ │   Redirecting to dashboard...    │  │
│ │                                  │  │
│ │ Color: #28a745 (green)           │  │
│ │ Icon: ✓ Checkmark               │  │
│ │ Animation: Fade + redirect       │  │
│ │ Duration: Auto-dismiss after 1s │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

---

## 12. LOADING & TRANSITION STATES

### 12.1 Login Button States

```
┌────────────────────────────────────────┐
│ LOGIN BUTTON STATE TRANSITIONS          │
├────────────────────────────────────────┤
│                                        │
│ DEFAULT STATE:                         │
│ ┌──────────────────────────────────┐  │
│ │ [LOGIN]                          │  │
│ │ Background: #007bff              │  │
│ │ Cursor: pointer                  │  │
│ │ Text: "LOGIN"                    │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ HOVER STATE:                           │
│ ┌──────────────────────────────────┐  │
│ │ [LOGIN]                          │  │
│ │ Background: #0056b3 (darker)     │  │
│ │ Scale: 1.02 (slight zoom)        │  │
│ │ Box-shadow: 0 4px 8px            │  │
│ │ Transition: 0.3s ease            │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ACTIVE/PRESSED STATE:                  │
│ ┌──────────────────────────────────┐  │
│ │ [LOGIN]                          │  │
│ │ Background: #003d82 (very dark)  │  │
│ │ Scale: 0.98 (slight press)       │  │
│ │ Box-shadow: inset 0 2px 4px      │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ LOADING STATE:                         │
│ ┌──────────────────────────────────┐  │
│ │ [⟳] LOGGING IN...                │  │
│ │ Background: #0056b3              │  │
│ │ Spinner: Rotating circle         │  │
│ │ Text: "LOGGING IN..." or "⟳"    │  │
│ │ Disabled: true                   │  │
│ │ Cursor: not-allowed              │  │
│ │ Duration: Variable (max 30s)     │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ SUCCESS STATE:                         │
│ ┌──────────────────────────────────┐  │
│ │ [✓] SUCCESS                      │  │
│ │ Background: #28a745 (green)      │  │
│ │ Icon: ✓ Checkmark               │  │
│ │ Text: "SUCCESS"                  │  │
│ │ Disabled: true                   │  │
│ │ Duration: 1-2 seconds            │  │
│ │ Then: Redirect to dashboard      │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ERROR STATE:                           │
│ ┌──────────────────────────────────┐  │
│ │ [LOGIN]                          │  │
│ │ Background: #ff6b6b (red)        │  │
│ │ Text: "LOGIN"                    │  │
│ │ Animation: Shake 0.5s            │  │
│ │ Error message below: Visible     │  │
│ │ Re-enabled: Immediate            │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ DISABLED STATE:                        │
│ ┌──────────────────────────────────┐  │
│ │ [LOGIN]                          │  │
│ │ Background: #4a4a4a (gray)       │  │
│ │ Opacity: 0.5                     │  │
│ │ Cursor: not-allowed              │  │
│ │ Pointer-events: none             │  │
│ │ Reason: Form invalid             │  │
│ │                                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ANIMATIONS:                            │
│ ├─ Button press: 100ms scale down      │
│ ├─ Loading spinner: Infinite rotation  │
│ ├─ Success bounce: Spring effect       │
│ ├─ Error shake: Horizontal wiggle      │
│ ├─ Fade transitions: 300ms ease        │
│ └─ All easing: ease-in-out             │
│                                        │
└────────────────────────────────────────┘
```

---

## 13. METADATA & SPECIFICATIONS

**System:** UT Service Console v1.0
**Environment:** Web Application (Responsive)
**Theme:** Dark Mode (Default)
**Format:** Login Interface
**Last Updated:** 26/05/2026
**Document Version:** Login Design v1.0

---

## 14. SUMMARY - LOGIN PAGE FEATURES

### Core Features:
✅ **Email/Password Login** - Traditional credentials
✅ **UT Service OAuth** - Company-wide single sign-on
✅ **Microsoft OAuth** - Enterprise integration
✅ **Password Recovery** - Forgot password flow
✅ **Sign Up Link** - Account creation
✅ **Remember Me** - Session persistence
✅ **Responsive Design** - All devices
✅ **Dark Theme** - Modern interface
✅ **Security** - HTTPS, CSRF, rate limiting
✅ **Accessibility** - WCAG 2.1 AA compliant

### Design Elements:
✅ **Background Image** - Heavy machinery/excavator
✅ **Company Branding** - Logo & company info
✅ **Dark Color Scheme** - Professional look
✅ **Smooth Animations** - Loading & transitions
✅ **Error Handling** - Clear feedback
✅ **Mobile Optimized** - Touch-friendly
✅ **Fast OAuth** - One-click sign-in
✅ **Form Validation** - Real-time checking

---

*This document provides complete specification for UT Service Console Login Page with multiple authentication methods and professional design.*
