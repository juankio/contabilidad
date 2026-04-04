import { MODULES, type ModuleNavItem, type OptionalModuleKey } from '../../utils/modules'
import { useProfileState } from '../profile/useProfileState'

export function useModuleNavigation() {
  const { activeModules } = useProfileState()

  const navItems = computed<ModuleNavItem[]>(() => {
    const items: ModuleNavItem[] = []
    const base = MODULES.find(module => module.key === 'contabilidad')
    if (base) {
      items.push(...base.nav)
    }

    const enabled = new Set(activeModules.value as OptionalModuleKey[])
    for (const module of MODULES) {
      if (module.key === 'contabilidad') continue
      if (enabled.has(module.key as OptionalModuleKey)) {
        items.push(...module.nav)
      }
    }
    return items
  })

  return { navItems }
}
