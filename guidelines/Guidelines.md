1. Technical Stack Constraints
Frontend: React.js components using Functional Hooks (useState, useEffect).
Styling: Tailwind CSS (Utility-first). No custom CSS files; use Tailwind classes for everything (spacing, colors, responsive).
Backend Interface: Node.js/Express. Prepare the UI to receive JSON data for the "Services" and "Contributions" sections.
Clean Code: Components must be modular (e.g., Header.jsx, ServiceCard.jsx, PaymentForm.jsx).
Component Architecture (Design to Code)
Auto-Layout: All design frames must use Auto-Layout to ensure a perfect translation to Flexbox/Grid in Tailwind.
Naming Convention: Use PascalCase for components (e.g., HeroSection, ContactForm).
Responsive: Design for 3 breakpoints: Mobile (375px), Tablet (768px), and Desktop (1440px).
Design Tokens (Tailwind Config)
Primary: bg-[#8B0000] (Bordeaux HLA).
Secondary: bg-[#1A1A1B] (Professional Gray/Black).
Fonts: Sans-serif for UI (Inter), Serif for Legal Titles (Merriweather).
