# Quotation Milestone — Design Improvement

> **Record:** Quote / Quotation `00148203`  
> **Opportunity:** NFT-S:BOTLE PAP 2 Pcs_MHA

---

## Current State

```
✓ PROSPECTING  ✓ SUBMIT  ✓ PREPARATION  ► QUOTATION  NEGOTIATION  CLOSED
```

| Step | Status | Color |
|------|--------|-------|
| Prospecting | Completed | Green |
| Submit | Completed | Green |
| Preparation | Completed | Green |
| Quotation | **Active** | Yellow/Amber |
| Negotiation | Inactive | Gray |
| Closed | Inactive | Gray |

---

## Proposed Improvements

### 1. Add Step Labels for Active State

Tambahkan sub-label di bawah step aktif untuk memberi konteks lebih jelas.

```
✓ PROSPECTING  ✓ SUBMIT  ✓ PREPARATION  ► QUOTATION        NEGOTIATION  CLOSED
                                           Sent 27/05/2026
```

| Field tambahan | Detail |
|----------------|--------|
| Date sent | Tanggal quotation dikirim ke customer |
| Sent by | Nama agent/user yang mengirim |
| Due date | Deadline response dari customer |

---

### 2. Tambah Step: "SENT TO CUSTOMER"

Pisahkan antara *membuat* quotation dan *mengirimkan* ke customer.

```
✓ PROSPECTING  ✓ SUBMIT  ✓ PREPARATION  ► QUOTATION  SENT  NEGOTIATION  CLOSED
```

| Step Baru | Trigger | Aksi |
|-----------|---------|------|
| SENT | Klik tombol "Send Quotation" | Otomatis log timestamp + user |

---

### 3. Perbaikan Tombol Action

| Tombol Saat Ini | Tombol Usulan | Alasan |
|-----------------|---------------|--------|
| `+ Follow` | `+ Follow` | Tetap |
| `Submit For Approval` | `Submit For Approval` | Tetap |
| `Approve/Reject Approval` | Pisah jadi 2 tombol: `✓ Approve` & `✗ Reject` | Lebih tegas, kurangi human error |

```
[ + Follow ]  [ Submit For Approval ]  [ ✓ Approve ]  [ ✗ Reject ]
```

---

### 4. Warna & Status Token

| Step | Status | Warna |
|------|--------|-------|
| Prospecting | Done | `#22C55E` Green |
| Submit | Done | `#22C55E` Green |
| Preparation | Done | `#22C55E` Green |
| Quotation | **Active** | `#EAB308` Amber |
| Sent to Customer | Pending | `#F97316` Orange *(baru)* |
| Negotiation | Pending | `#94A3B8` Gray |
| Closed | Pending | `#94A3B8` Gray |

---

### 5. Tooltip on Hover (tiap step)

Saat hover pada step yang sudah selesai, tampilkan:

```
┌──────────────────────────────┐
│ ✓ PREPARATION                │
│ Completed: 26/05/2026, 14:30 │
│ By: Suryadi Suryadi          │
└──────────────────────────────┘
```

---

## Summary Perubahan

| No | Item | Prioritas |
|----|------|-----------|
| 1 | Sub-label tanggal di step aktif | High |
| 2 | Pisah tombol Approve / Reject | High |
| 3 | Tambah step "Sent to Customer" | Medium |
| 4 | Tooltip hover per step | Medium |
| 5 | Token warna "Sent" = Orange | Low |

---

*Improvement notes v1.0 — Quotation 00148203*
