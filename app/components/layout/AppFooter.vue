<template>
  <footer class="mt-auto border-t border-slate-100 bg-white py-5">
    <div class="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 sm:flex-row sm:justify-between">
      <div class="flex items-center gap-2 text-sm text-slate-400">
        <svg
          width="16"
          height="16"
          viewBox="0 0 30 30"
          fill="none"
          class="shrink-0 opacity-60"
        >
          <rect
            width="30"
            height="30"
            rx="8"
            style="fill: var(--brand-600)"
          />
          <path
            d="M9 11h12"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M9 15.5h8"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M9 20h10"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span>Mi Contabilidad</span>
      </div>

      <p class="text-sm text-slate-400">
        Hecho con
        <span class="mx-0.5 text-rose-400">♥</span>
        por
        <a
          href="https://github.com/juankio"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-slate-600 transition-colors hover:text-slate-900"
          style="text-decoration-color: var(--brand-600)"
          :class="'underline-offset-2 hover:underline'"
        >
          Miguel
        </a>
        &middot; {{ new Date().getFullYear() }}
      </p>
    </div>
  </footer>
</template>
