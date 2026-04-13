export type TimeBarSegmentTone =
  | 'warning'
  | 'danger'
  | 'success'
  | 'primary'
  | 'neutral';

export type TimeBarSegment = {
  id: string;
  value: number;
  tone?: TimeBarSegmentTone;
};

export type TimeBarProps = {
  segments: TimeBarSegment[];
  labels?: string[];
  className?: string;
  height?: 'sm' | 'md';
  onSegmentClick?: (segmentId: string, event: React.MouseEvent) => void;
};