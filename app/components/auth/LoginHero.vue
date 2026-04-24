<template>
  <div class="flex h-full flex-col justify-center gap-8 lg:pr-12">
    <div>
      <h2 class="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
        Control total <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)]">
          en un solo lugar
        </span>
      </h2>
      <p class="mt-6 text-lg font-medium text-slate-600 max-w-lg leading-relaxed">
        Gestiona finanzas, inventarios y equipos con una interfaz diseñada para ser ridículamente rápida y fácil de usar.
      </p>
    </div>

    <ul class="space-y-4 text-slate-700">
      <li class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] shadow-sm">
          <UIcon name="lucide:zap" class="h-4 w-4" />
        </div>
        <span class="font-semibold text-base">Acceso ultra-rápido a tu panel.</span>
      </li>
      <li class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] shadow-sm">
          <UIcon name="lucide:lock" class="h-4 w-4" />
        </div>
        <span class="font-semibold text-base">Información privada y encriptada.</span>
      </li>
      <li class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] shadow-sm">
          <UIcon name="lucide:layout" class="h-4 w-4" />
        </div>
        <span class="font-semibold text-base">Diseño minimalista sin distracciones.</span>
      </li>
    </ul>

    <!-- Decorative Card -->
    <div class="mt-4 hidden lg:block rounded-2xl border border-slate-200/50 bg-white/60 p-5 shadow-lg backdrop-blur-sm max-w-sm rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--brand-400)] to-[var(--brand-600)]" />
        <div>
          <div class="h-3 w-24 rounded-full bg-slate-200 mb-2" />
          <div class="h-2 w-16 rounded-full bg-slate-100" />
        </div>
      </div>
      <div class="space-y-2">
        <div class="h-2 w-full rounded-full bg-slate-100" />
        <div class="h-2 w-4/5 rounded-full bg-slate-100" />
        <div class="h-2 w-full rounded-full bg-slate-100" />
      </div>
    </div>
  </div>
</template>
