<template>
  <div
    class="login-pattern"
    aria-hidden="true"
  >
    <div class="glow glow-magenta" />
    <div class="glow glow-cyan" />
    <div class="glow glow-yellow" />
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
  background:
    radial-gradient(760px 420px at 10% 20%, rgba(148, 163, 184, 0.26), transparent 62%),
    radial-gradient(760px 520px at 90% 10%, rgba(125, 211, 252, 0.22), transparent 60%),
    radial-gradient(920px 620px at 50% 120%, rgba(99, 102, 241, 0.13), transparent 66%),
    linear-gradient(180deg, #f8fafc, #eef2f7);
}

.glow {
  position: absolute;
  inset: -20%;
  filter: blur(28px);
  opacity: 0.45;
  animation: drift 18s ease-in-out infinite;
}

.glow-magenta {
  background: radial-gradient(circle at 22% 25%, rgba(59, 130, 246, 0.2), transparent 46%);
}

.glow-cyan {
  background: radial-gradient(circle at 82% 14%, rgba(14, 165, 233, 0.18), transparent 46%);
  animation-delay: -6s;
}

.glow-yellow {
  background: radial-gradient(circle at 52% 88%, rgba(168, 85, 247, 0.14), transparent 54%);
  animation-delay: -12s;
}

.grain {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      135deg,
      rgba(100, 116, 139, 0.1) 0 9px,
      transparent 9px 18px
    );
  opacity: 0.45;
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
