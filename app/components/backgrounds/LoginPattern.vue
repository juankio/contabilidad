<template>
  <div
    class="login-pattern"
    aria-hidden="true"
  >
    <div class="glow glow-1 bg-[var(--brand-500)]" />
    <div class="glow glow-2 bg-[var(--brand-400)]" />
    <div class="glow glow-3 bg-[var(--brand-600)]" />
    <div class="grain" />
  </div>
</template>

<style scoped>
.login-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f8fafc;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  animation: drift 20s ease-in-out infinite alternate;
}

.glow-1 {
  top: 10%;
  left: 10%;
  width: 60vw;
  height: 60vw;
  opacity: 0.15;
}

.glow-2 {
  top: 10%;
  right: -10%;
  width: 50vw;
  height: 50vw;
  opacity: 0.12;
  animation-delay: -5s;
}

.glow-3 {
  bottom: -20%;
  left: 30%;
  width: 70vw;
  height: 70vw;
  opacity: 0.1;
  animation-delay: -10s;
}

.grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.25;
  mix-blend-mode: overlay;
  pointer-events: none;
}

@keyframes drift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(5%, -5%) scale(1.05);
  }
  100% {
    transform: translate(-3%, 3%) scale(0.95);
  }
}
</style>
