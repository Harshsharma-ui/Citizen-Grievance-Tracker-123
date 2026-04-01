# CitizenConnect: Municipal Grievance Tracker (WD-02)

A production-ready MVP for municipal issue tracking, built for speed, reliability, and visual impact.

## 🚀 Hackathon MVP Features
- **Strict RBAC**: Citizen, Officer, and Admin roles with tailored dashboards.
- **Real-Time Heatmap**: Weighted visual density map of municipal issues in Mumbai.
- **Mobile-First UX**: iOS-optimized UI with sticky panels, safe-area insets, and 44px tap targets.
- **Lifecycle Management**: Automated assignment logic and state machine workflow.
- **Cloudinary Integration**: Fast, unsigned image uploads for field reporting.
- **Supabase Realtime**: Instant dashboard updates on grievance submission.

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **Backend**: Supabase (Auth, PostgreSQL, Realtime).
- **Maps**: Leaflet.js, React-Leaflet, Leaflet.heat.
- **Icons**: Lucide React.

## 📂 Database Schema (Supabase)
The system uses a relational PostgreSQL schema with Row-Level Security (RLS):
- `profiles`: User roles and department associations.
- `departments`: Municipal divisions (Roads, Water, Sanitation).
- `complaints`: The core grievance entity with status, severity, and geo-coordinates.
- `complaint_images`: Links to Cloudinary-hosted assets.

## 🚦 Complaint Lifecycle
`DRAFT` → `SUBMITTED` → `ASSIGNED` (Auto) → `IN_PROGRESS` → `RESOLVED` / `REJECTED`

## ⚙️ Setup Instructions

### 1. Supabase Configuration
1. Create a new Supabase project.
2. Run the contents of `supabase_setup.sql` in the SQL Editor.
3. Copy your Project URL and Anon Key.
4. Set environment variables:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Cloudinary Setup
1. Create a Cloudinary account.
2. Enable "Unsigned Uploads" in Settings -> Upload.
3. Update the `cloudName` and `uploadPreset` in `src/components/citizen/CitizenForm.tsx`.

### 3. Local Development
```bash
npm install
npm run dev
```

## 📸 Demo Views
- **Citizen Portal**: Multi-step animated form with map picker.
- **Officer View**: Task management with swipeable status drawers.
- **Municipal Heatmap**: Global view of issue density and severity.

---
Built with ❤️ for the 24-Hour Hackathon.
