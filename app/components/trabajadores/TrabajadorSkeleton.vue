<template>
  <div class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-transparent p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <USkeleton class="h-10 w-10 shrink-0 rounded-xl" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-3 w-16" />
        </div>
      </div>
      <USkeleton class="h-8 w-8 rounded-lg" />
    </div>
    <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
      <USkeleton class="h-3 w-16" />
      <USkeleton class="h-4 w-20" />
    </div>
  </div>
</template>