const PROFILE_REFRESH_KEYS = [
  'resumen',
  'movimientos',
  'categorias',
  'gastos',
  'gastos-grouped',
  'estadisticas'
] as const

export async function refreshProfilePageData() {
  await refreshNuxtData([...PROFILE_REFRESH_KEYS])
}
