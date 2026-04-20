import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './DayDetailsChart.module.scss';

export type ActivityType = 'productive' | 'neutral' | 'unproductive' | 'uncategorized';

export interface TimeSegment {
    id: string;
    type: ActivityType;
    startPercent: number;
    widthPercent: number;
    tooltipTime: string;
}

export interface DayActivityData {
    employeeName: string;
    date: string;
    department: string;

    donutSegments: {
        type: ActivityType;
        percent: number;
        duration: string;
    }[];

    timelineSegments: TimeSegment[];

    stats: {
        active: string;
        productive: string;
        unproductive: string;
        neutral: string;
        uncategorized: string;
        firstActivity: string;
        lastActivity: string;
        timeAtWork: string;
    };
}

interface Props {
    data: DayActivityData;
}

const colorMap: Record<ActivityType, string> = {
    productive: '#8DE4DB',
    neutral: '#FFCC00',
    unproductive: '#FF0000',
    uncategorized: '#D2D5DB',
};

const SVG_W = 1000;
const SVG_H = 150;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const AREA_TYPES: ActivityType[] = ['unproductive', 'neutral', 'uncategorized', 'productive'];

const NUM_POINTS = 60;

/** Generate smooth wave data points for each activity type from timeline segments */
function generateWavePoints(segments: TimeSegment[], type: ActivityType): number[] {
    const points: number[] = new Array(NUM_POINTS).fill(0);
    const segs = segments.filter(s => s.type === type);

    segs.forEach(seg => {
        const centerX = (seg.startPercent + seg.widthPercent / 2) / 100;
        const spread = Math.max(seg.widthPercent / 100, 0.04) * 2.5;
        const peak = 0.35 + (seg.startPercent % 17) / 17 * 0.5;

        for (let i = 0; i < NUM_POINTS; i++) {
            const x = i / (NUM_POINTS - 1);
            const dist = Math.abs(x - centerX);
            const gauss = peak * Math.exp(-(dist * dist) / (2 * spread * spread));
            points[i] += gauss;
        }
    });

    // Clamp to [0, 1]
    for (let i = 0; i < NUM_POINTS; i++) {
        points[i] = Math.min(points[i], 1);
    }

    return points;
}

/** Build a smooth SVG area path using cubic bezier curves */
function buildSmoothAreaPath(points: number[], w: number, h: number): string {
    if (points.length < 2) return '';

    const coords = points.map((val, i) => ({
        x: (i / (points.length - 1)) * w,
        y: h - val * h * 0.85,
    }));

    let d = `M 0 ${h} L ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;

    for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[Math.max(i - 1, 0)];
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const p3 = coords[Math.min(i + 2, coords.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    d += ` L ${w} ${h} Z`;
    return d;
}


const CX = 70;
const CY = 70;
const RADIUS = 48;
const LABELS_MIN_GAP = 16;

export const DayDetailsChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const [hoveredType, setHoveredType] = useState<ActivityType | null>(null);

    const getLabel = (type: ActivityType) => t(`activity.timeline.legend.${type}`);

    const circumference = 2 * Math.PI * RADIUS;

    // ── DONUT label positions ──
    const rawLabels = data.donutSegments.map((seg, index) => {
        const previousPercent = data.donutSegments
            .slice(0, index)
            .reduce((sum, segment) => sum + segment.percent, 0);
        const midP = previousPercent + seg.percent / 2;

        const angle = (midP / 100) * 2 * Math.PI - Math.PI / 2;
        const x1 = CX + RADIUS * Math.cos(angle);
        const y1 = CY + RADIUS * Math.sin(angle);
        const xBend = CX + (RADIUS + 10) * Math.cos(angle);
        const yBend = CY + (RADIUS + 10) * Math.sin(angle);
        const isLeft = Math.cos(angle) < 0;

        return {
            seg,
            x1, y1,
            xBend, yBend,
            yLabel: yBend,
            isLeft,
            xLabelStart: isLeft ? 8 : 132,
        };
    });

    const resolveCollisions = (labels: typeof rawLabels) => {
        labels.sort((a, b) => a.yLabel - b.yLabel);
        for (let i = 1; i < labels.length; i++) {
            if (labels[i].yLabel - labels[i - 1].yLabel < LABELS_MIN_GAP) {
                labels[i].yLabel = labels[i - 1].yLabel + LABELS_MIN_GAP;
            }
        }
        const MAX_Y = 138;
        if (labels.length > 0 && labels[labels.length - 1].yLabel > MAX_Y) {
            let overflow = labels[labels.length - 1].yLabel - MAX_Y;
            for (let i = labels.length - 1; i >= 0; i--) {
                labels[i].yLabel -= overflow;
                if (i > 0 && labels[i].yLabel - labels[i - 1].yLabel < LABELS_MIN_GAP) {
                    overflow = LABELS_MIN_GAP - (labels[i].yLabel - labels[i - 1].yLabel);
                } else {
                    break;
                }
            }
        }
    };

    const leftLabels = rawLabels.filter(l => l.isLeft);
    const rightLabels = rawLabels.filter(l => !l.isLeft);
    resolveCollisions(leftLabels);
    resolveCollisions(rightLabels);
    const labelsInfo = [...leftLabels, ...rightLabels];

    // ── SMOOTH AREA CHART data generation ──
    const areaPaths = useMemo(() => {
        const paths: { type: ActivityType; path: string }[] = [];

        AREA_TYPES.forEach(type => {
            const wavePoints = generateWavePoints(data.timelineSegments, type);
            const hasData = wavePoints.some(p => p > 0);
            if (!hasData) return;

            const path = buildSmoothAreaPath(wavePoints, SVG_W, SVG_H);
            if (path) {
                paths.push({ type, path });
            }
        });

        return paths;
    }, [data.timelineSegments]);

    return (
        <div className={styles.card}>
            <h3 className={styles.chartTitle}>{data.date}, {data.department}, {data.employeeName}</h3>

            <div className={styles.chartArea}>
                {/* ── DONUT CHART 140×140 ── */}
                <div className={styles.donutColumn}>
                    <div className={styles.svgWrapper}>
                        <svg viewBox="0 0 140 140" className={styles.donutSvg}>
                            <circle cx={CX} cy={CY} r={RADIUS} fill="transparent" stroke="#edf1f7" strokeWidth="16" />
                            {data.donutSegments.map((seg, index) => {
                                const info = labelsInfo.find(l => l.seg.type === seg.type)!;
                                const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`;
                                const previousPercent = data.donutSegments
                                    .slice(0, index)
                                    .reduce((sum, segment) => sum + segment.percent, 0);
                                const dashoffset = (circumference * 0.25) - ((previousPercent / 100) * circumference);

                                const isDimmed = hoveredType && hoveredType !== seg.type;
                                const { x1, y1, xLabelStart, yLabel, isLeft } = info;

                                return (
                                    <React.Fragment key={seg.type}>
                                        <circle
                                            cx={CX}
                                            cy={CY}
                                            r={RADIUS}
                                            fill="transparent"
                                            stroke={colorMap[seg.type]}
                                            strokeWidth="16"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={dashoffset}
                                            className={classNames(styles.donutSegment, { [styles.dimmed]: isDimmed })}
                                            onMouseEnter={() => setHoveredType(seg.type)}
                                            onMouseLeave={() => setHoveredType(null)}
                                            style={{ transition: 'opacity 0.2s', strokeLinecap: 'butt' }}
                                        />
                                        <polyline
                                            points={`${x1},${y1} ${xLabelStart},${yLabel}`}
                                            className={classNames(styles.donutPolyline, { [styles.dimmed]: isDimmed })}
                                        />
                                        <text
                                            x={xLabelStart + (isLeft ? -3 : 3)}
                                            y={yLabel + 4}
                                            textAnchor={isLeft ? 'end' : 'start'}
                                            className={classNames(styles.donutSvgText, { [styles.dimmed]: isDimmed })}
                                        >
                                            {seg.duration} ({seg.percent}%)
                                        </text>
                                    </React.Fragment>
                                );
                            })}
                        </svg>
                    </div>

                    <div className={styles.donutLegend}>
                        {data.donutSegments.map(seg => (
                            <div
                                key={seg.type}
                                className={classNames(styles.legendItem, { [styles.dimmed]: hoveredType && hoveredType !== seg.type })}
                                onMouseEnter={() => setHoveredType(seg.type)}
                                onMouseLeave={() => setHoveredType(null)}
                            >
                                <span className={styles.legendColor} style={{ backgroundColor: colorMap[seg.type] }} />
                                {getLabel(seg.type)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── AREA CHART ── */}
                <div className={styles.timelineColumn}>
                    <div className={styles.areaChartWrapper}>
                        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className={styles.areaChartSvg} preserveAspectRatio="none">
                            {areaPaths.map(({ type, path }) => (
                                <path
                                    key={type}
                                    d={path}
                                    fill={colorMap[type]}
                                    className={classNames(styles.areaPath, { [styles.dimmed]: hoveredType && hoveredType !== type })}
                                    opacity={0.75}
                                    onMouseEnter={() => setHoveredType(type)}
                                    onMouseLeave={() => setHoveredType(null)}
                                />
                            ))}
                        </svg>
                    </div>

                    <div className={styles.hourLabels}>
                        {HOURS.map(hour => (
                            <span key={hour} className={styles.hourLabel}>
                                {hour.toString().padStart(2, '0')}:00
                            </span>
                        ))}
                    </div>

                    {/* ── DATA TABLE ── */}
                    <div className={styles.statsTable}>
                        <div className={styles.tableRowHeader}>
                            <div>{t('dashboard.cards.activity')}</div>
                            <div>{t('dashboard.cards.productive')}</div>
                            <div>{t('dashboard.cards.unproductive')}</div>
                            <div>{t('dashboard.cards.neutral')}</div>
                            <div>{t('dashboard.efficiency.legend.uncategorized')}</div>
                            <div>{t('reports.workTime.table.firstActivity')}</div>
                            <div>{t('reports.workTime.table.lastActivity')}</div>
                            <div>{t('reports.workTime.table.timeAtWork')}</div>
                        </div>
                        <div className={styles.tableRowData}>
                            <div>{data.stats.active}</div>
                            <div>{data.stats.productive}</div>
                            <div>{data.stats.unproductive}</div>
                            <div>{data.stats.neutral}</div>
                            <div>{data.stats.uncategorized}</div>
                            <div>{data.stats.firstActivity}</div>
                            <div>{data.stats.lastActivity}</div>
                            <div>{data.stats.timeAtWork}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
