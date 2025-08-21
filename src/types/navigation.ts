export interface NavItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
  children?: NavItem[];
}