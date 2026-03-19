export interface ChipProps {
  children: React.ReactNode;
  tone?: 'purple' | 'red' | 'yellow' | 'green' | 'blue' | 'gray';
  variant?: 'list' | 'filter'; 
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}