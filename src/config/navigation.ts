import type { RouteRecordRaw } from 'vue-router'
import Dashboard from '@/components/Dashboard/Dashboard.vue'
import WorkItems from '@/components/WorkItems/WorkItems.vue'
import Backlogs from '@/components/Backlogs/Backlogs.vue'
import Sprints from '@/components/Sprints/Sprints.vue'

export enum MenuKey {
  Dashboard = 'Dashboard',
  WorkItems = 'Work Items',
  Backlogs = 'Backlogs',
  Sprints = 'Sprints'
}

export interface NavigationItem {
  key: MenuKey
  label: string
  icon: string
  to: string
  component: any
}

export const NAVIGATION_CONFIG: readonly NavigationItem[] = [
  {
    key: MenuKey.Dashboard,
    label: MenuKey.Dashboard,
    icon: 'pi pi-chart-bar',
    to: '/dashboard',
    component: Dashboard
  },
  {
    key: MenuKey.WorkItems,
    label: MenuKey.WorkItems,
    icon: 'pi pi-objects-column',
    to: '/work-items',
    component: WorkItems
  },
  {
    key: MenuKey.Backlogs,
    label: MenuKey.Backlogs,
    icon: 'pi pi-th-large',
    to: '/backlogs',
    component: Backlogs
  },
  {
    key: MenuKey.Sprints,
    label: MenuKey.Sprints,
    icon: 'pi pi-stop',
    to: '/sprints',
    component: Sprints
  }
] as const

export const ROUTES: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  ...NAVIGATION_CONFIG.map(item => ({
    path: item.to,
    name: item.key,
    component: item.component
  }))
]

export type MenuItem = Omit<NavigationItem, 'component'>

export const MENU_ITEMS: readonly MenuItem[] = NAVIGATION_CONFIG.map(item => ({
  key: item.key,
  label: item.label,
  icon: item.icon,
  to: item.to
})) as readonly MenuItem[]
