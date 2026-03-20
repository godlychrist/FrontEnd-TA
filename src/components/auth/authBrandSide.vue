<template>
  <div class="brand-side">
    <div class="brand-content">
      <img src="../../assets/ferrari-logo.png" alt="Ferrari Logo" class="brand-logo">
      <h1 class="premium-title">TICO<span>AUTOS</span></h1>
      <p class="premium-subtitle">Exclusividad en cada kilómetro</p>
      <div class="decorative-line"></div>
    </div>
  </div>
</template>

<style scoped>
.brand-logo {
  width: 150px;
  height: auto;
  margin-bottom: 24px;
  filter: drop-shadow(0 0 20px rgba(139, 26, 74, 0.5));
  transition: var(--transition-bounce);
}

.brand-logo:hover {
  transform: scale(1.08) rotate(3deg);
  filter: drop-shadow(0 0 30px rgba(139, 26, 74, 0.7));
}
</style>

<script setup>
</script>
