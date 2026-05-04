<template>
  <main class="min-h-screen w-full overflow-x-hidden bg-transparent fintech-bg text-slate-900">
    <section class="mx-auto w-full max-w-screen-2xl overflow-x-clip px-4 md:px-6 pb-12 pt-8">
      <AppPageHeader />

      <!-- Grid de tarjetas principal -->
      <div class="grid w-full gap-6 lg:grid-cols-12 items-start mt-6">
        <!-- Columna Izquierda: Balance y Categorías (4 columnas) -->
        <div class="flex flex-col gap-6 lg:col-span-4 min-w-0 w-full">
          <BalanceCard />
          <CategoriesCard />
        </div>

        <!-- Columna Derecha: Formulario y Movimientos (8 columnas) -->
        <div class="flex flex-col gap-6 lg:col-span-8 min-w-0 w-full">
          <MovementForm />
          <RecentMovements />
        </div>
      </div>
    </section>
  </main>
</template>
