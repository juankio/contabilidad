<template>
  <div
    class="app-pattern"
    aria-hidden="true"
  >
    <div class="glow glow-brand-primary" />
    <div class="glow glow-brand-secondary" />
    <div class="glow glow-brand-tertiary" />
    <div class="grain" />
  </div>
</template>

<style scoped>
.app-pattern {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(760px 420px at 10% 20%, color-mix(in srgb, var(--brand-500) 5%, transparent), transparent 62%),
    radial-gradient(760px 520px at 90% 10%, color-mix(in srgb, var(--brand-300) 8%, transparent), transparent 60%),
    radial-gradient(920px 620px at 50% 120%, color-mix(in srgb, var(--brand-600) 4%, transparent), transparent 66%),
    linear-gradient(180deg, #f8fafc, #eef2f7);
  z-index: -1;
}

.glow {
  position: absolute;
  inset: -20%;
  filter: blur(40px);
  opacity: 0.35;
  animation: drift 20s ease-in-out infinite;
}

.glow-brand-primary {
  background: radial-gradient(circle at 22% 25%, color-mix(in srgb, var(--brand-500) 12%, transparent), transparent 46%);
}

.glow-brand-secondary {
  background: radial-gradient(circle at 82% 14%, color-mix(in srgb, var(--brand-400) 10%, transparent), transparent 46%);
  animation-delay: -7s;
}

.glow-brand-tertiary {
  background: radial-gradient(circle at 52% 88%, color-mix(in srgb, var(--brand-600) 8%, transparent), transparent 54%);
  animation-delay: -14s;
}

.grain {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      135deg,
      rgba(100, 116, 139, 0.08) 0 9px,
      transparent 9px 18px
    );
  opacity: 0.35;
  mix-blend-mode: multiply;
}

@keyframes drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(2%, -2%, 0) scale(1.03);
  }
}
</style>
