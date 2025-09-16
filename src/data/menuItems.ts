export enum MenuKey {
  Dashboard = 'Dashboard',
  WorkItems = 'Work Items',
  Backlogs = 'Backlogs',
  Sprints = 'Sprints'
}

export type MenuItem = {
  key: MenuKey;
  label: string;
  icon: string;
};

export const MENU_ITEMS: readonly MenuItem[] = [
  { key: MenuKey.Dashboard, label: MenuKey.Dashboard, icon: 'pi pi-chart-bar' },
  { key: MenuKey.WorkItems, label: MenuKey.WorkItems, icon: 'pi pi-objects-column' },
  { key: MenuKey.Backlogs, label: MenuKey.Backlogs, icon: 'pi pi-th-large' },
  { key: MenuKey.Sprints, label: MenuKey.Sprints, icon: 'pi pi-stop' }
] as const;
