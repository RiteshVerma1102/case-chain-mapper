# 🔍 CaseChain — Case Investigation & Relationship Intelligence Platform

CaseChain is an enterprise-grade investigation and relationship intelligence platform engineered for complex case tracking, multi-entity intelligence mapping, visual network analysis, chronological timeline sequencing, digital/forensic evidence custody management, real-time alert triaging, and automated PDF intelligence report generation.

🌐 **Production Deployment:** [https://case-chain-mapper-main.vercel.app/](https://case-chain-mapper-main.vercel.app/)

---

## 🎯 Key Capabilities

- **📁 Comprehensive Case Management**: Create, classify, prioritize, search, filter, and track case statuses across stages (`Under Investigation`, `Pending Evidence`, `In Review`, `Closed`).
- **👥 Entity Intelligence Management**: Profile individuals, organizations, locations, digital accounts, vehicles, and assets with risk tiering and relationship association counts.
- **🕸️ Interactive SVG Network Graph**: Force-directed and clustered multi-entity relationship mapping with directionality indicators, strength weighting (`strong`, `moderate`, `weak`), degree of separation filtering, and zoom/pan controls.
- **⏱️ Chronological Case Timeline**: Linear chronological event sequence with event type categorizations, verified badges, importance flags, source documents, and entity taggings.
- **🔒 Chain-of-Custody Evidence Locker**: Secure digital and physical asset logging, MD5/SHA-256 integrity hash verification, handling history, and file previewing.
- **⚠️ Real-Time Anomaly & Threat Alerts**: High/Medium/Low priority automated notifications detecting suspicious financial transfers, flight risks, cross-entity links, and missing documentation.
- **📊 Investigation Analytics**: Case resolution metrics, entity distribution charts, status breakdown, and workload tracking.
- **📑 Automated Intelligence Reports**: Export court-ready, cryptographically verifiable PDF intelligence dossiers with summary statistics, entity tables, and timeline breakdown using `jspdf` and `jspdf-autotable`.
- **🔐 Dual-Layer Authentication & Clearance**: Role-based access control (Lead Investigator, Senior Investigator, Analyst) with JWT authentication and local fallback demo clearance.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build System**: Vite 5
- **Routing**: React Router v6 (SPA routing with catch-all fallback configuration)
- **Styling**: Tailwind CSS & Lucide Icons
- **Visualization**: Interactive SVG Network Visualization & Recharts
- **PDF Generation**: `jspdf` & `jspdf-autotable`
- **UI Components**: Radix UI primitives, Sonner notifications

### Backend & API
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose (with offline local fallback simulation for zero-dependency live hosting)
- **Auth**: JSON Web Tokens (JWT) & bcryptjs password hashing

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/RiteshVerma1102/case-chain-mapper.git
cd case-chain-mapper
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development servers
```bash
# Start frontend client (Vite)
npm run dev

# (Optional) Start backend API server
node backend/server.js
```

### 4. Build for production
```bash
npm run build
```

---

## ☁️ Deployment

Configured for zero-config automatic deployment to Vercel with single-page application (SPA) routing via `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Production output directory: `dist`  
Build command: `npm run build`

---

## 👨‍💻 Author & Maintainers

- **Ritesh Verma** - [GitHub](https://github.com/RiteshVerma1102)
