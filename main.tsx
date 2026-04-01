@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@variant dark (&:where(.dark, .dark *));

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 1rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #1E293B;
}

::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}

/* Leaflet Dark Mode */
.dark .leaflet-container {
  background: #020617 !important;
}

.dark .leaflet-tile {
  filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
}

.dark .leaflet-control-zoom-in,
.dark .leaflet-control-zoom-out,
.dark .leaflet-control-attribution {
  background-color: #0f172a !important;
  color: #94a3b8 !important;
  border-color: #1e293b !important;
}

.dark .leaflet-popup-content-wrapper,
.dark .leaflet-popup-tip {
  background: #0f172a !important;
  color: #f1f5f9 !important;
  border: 1px solid #1e293b;
}

.dark .leaflet-popup-content {
  color: #f1f5f9 !important;
}

/* Glassmorphism Utilities */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.dark .glass {
  background: rgba(15, 23, 42, 0.7);
}

/* Smooth Transitions - Scoped to avoid breaking Leaflet */
body, button, input, select, textarea, .transition-colors {
  transition-property: background-color, border-color, color, fill, stroke, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Fix for choppy animations */
.motion-safe {
  will-change: transform, opacity;
}
