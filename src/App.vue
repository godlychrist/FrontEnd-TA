<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,500;1,600;1,700&display=swap');

:root {
  /* ═══ Black Cherry Palette ═══ */
  --black-cherry: #4A0D2B;
  --black-cherry-light: #6B1840;
  --black-cherry-dark: #2A0618;
  --black-cherry-vibrant: #8B1A4A;
  --black-cherry-glow: #C2185B;
  --black-cherry-soft: rgba(74, 13, 43, 0.35);
  
  /* ═══ Neutral Palette ═══ */
  --bg-main: #050507;
  --bg-elevated: #0C0C10;
  --bg-card: #111116;
  --bg-card-hover: #18181F;
  --text-main: #F0F0F5;
  --text-secondary: #C8C8D4;
  --text-muted: #8A8A9A;
  --text-dim: #55556A;
  
  /* ═══ Glassmorphism ═══ */
  --glass: rgba(255, 255, 255, 0.025);
  --glass-border: rgba(255, 255, 255, 0.07);
  --glass-hover: rgba(255, 255, 255, 0.05);
  --glass-strong: rgba(255, 255, 255, 0.08);
  
  /* ═══ Semantic Colors ═══ */
  --success: #10B981;
  --error: #EF4444;
  --warning: #F59E0B;
  --info: #6366F1;
  
  /* ═══ Accents & UI ═══ */
  --accent: var(--black-cherry-vibrant);
  --accent-glow: var(--black-cherry-glow);
  
  /* ═══ Effects ═══ */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.6);
  --shadow-cherry: 0 8px 32px rgba(74, 13, 43, 0.4);
  --shadow-cherry-lg: 0 16px 48px rgba(74, 13, 43, 0.5);
  --shadow-cherry-glow: 0 0 40px rgba(139, 26, 74, 0.25);
  --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* ═══ Border Radius ═══ */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-2xl: 40px;
  
  /* ═══ Typography ═══ */
  --font-main: 'Outfit', sans-serif;
  --font-accent: 'Playfair Display', Georgia, serif;
}

* {
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: var(--black-cherry-dark) transparent;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-main);
  background-image: 
    radial-gradient(ellipse at 0% 0%, rgba(74, 13, 43, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(74, 13, 43, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(74, 13, 43, 0.03) 0%, transparent 60%);
  font-family: 'Outfit', sans-serif;
  color: var(--text-main);
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ═══ Custom Scrollbar ═══ */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--black-cherry-dark);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--black-cherry);
}

/* ═══ Selection ═══ */
::selection {
  background: var(--black-cherry);
  color: white;
}

/* ═══ Page Transitions ═══ */
.page-enter-active, .page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ═══ Utility Animations ═══ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-cherry {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 13, 43, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(74, 13, 43, 0); }
}

@keyframes glow-rotate {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(15deg); }
}
</style>