import { MODULES, type ModuleNavItem, type OptionalModuleKey } from '../../utils/modules'
import { useProfileState } from '../profile/useProfileState'

export function useModuleNavigation() {
  const { activeModules } = useProfileState()

  const navItems = computed<ModuleNavItem[]>(() => {
    const items: ModuleNavItem[] = []
    
    // Core routes that are always visible in the main top bar
    const base = MODULES.find(module => module.key === 'contabilidad')
    if (base) {
      items.push(...base.nav)
    }

    const enabled = new Set(activeModules.value as OptionalModuleKey[])
    const reportesModule = MODULES.find(m => m.key === 'reportes')
    if (reportesModule && enabled.has('reportes')) {
      items.push(...reportesModule.nav)
    }

    return items
  })

  // The rest of the modules will be shown in the App Launcher (Mega Menu)
  const launcherItems = computed(() => {
    const items: (ModuleNavItem & { description: string, moduleKey: string })[] = []
    const enabled = new Set(activeModules.value as OptionalModuleKey[])
    
    for (const module of MODULES) {
      if (module.key === 'contabilidad' || module.key === 'reportes') continue
      
      if (enabled.has(module.key as OptionalModuleKey)) {
        // Assume each module has 1 primary route for the launcher
        const primaryNav = module.nav[0]
        if (primaryNav) {
          items.push({
            ...primaryNav,
            description: module.description,
            moduleKey: module.key
          })
        }
      }
    }
    return items
  })

  return { navItems, launcherItems }
}
