import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './DayDetailsChart.module.scss';

export type ActivityType = 'productive' | 'neutral' | 'unproductive' | 'uncategorized' | 'idle';

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
        idle: string;
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
    productive: '#2ebd59',
    neutral: '#e5b112',
    unproductive: '#ef4444',
    uncategorized: '#a0a5b1',
    idle: '#a96aeb',
};

const SVG_W = 1000;
const SVG_H = 150;
const NUM_POINTS = 200;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const AREA_TYPES: ActivityType[] = ['idle', 'unproductive', 'neutral', 'uncategorized', 'productive'];

export const DayDetailsChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const [hoveredType, setHoveredType] = useState<ActivityType | null>(null);

    const getLabel = (type: ActivityType) => t(`activity.timeline.legend.${type}`);

    // ── DONUT CHART calculation (unchanged logic) ──
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const LABELS_MIN_GAP = 16;
    let currentOffset = 0;

    const rawLabels = data.donutSegments.map((seg) => {
        const midP = currentOffset + seg.percent / 2;
        currentOffset += seg.percent;

        const angle = (midP / 100) * 2 * Math.PI - Math.PI / 2;
        const x1 = 80 + radius * Math.cos(angle);
        const y1 = 80 + radius * Math.sin(angle);
        const xBend = 80 + (radius + 12) * Math.cos(angle);
        const yBend = 80 + (radius + 12) * Math.sin(angle);
        const isLeft = Math.cos(angle) < 0;

        return {
            seg,
            midP,
            angle,
            x1, y1,
            xBend, yBend,
            yLabel: yBend, // initial target Y
            isLeft,
            xLabelStart: isLeft ? 10 : 150
        };
    });

    // Simple collision resolver by shifting yLabel
    const resolveCollisions = (labels: typeof rawLabels) => {
        labels.sort((a, b) => a.yLabel - b.yLabel);

        // Push down
        for (let i = 1; i < labels.length; i++) {
            const prev = labels[i - 1];
            const curr = labels[i];
            if (curr.yLabel - prev.yLabel < LABELS_MIN_GAP) {
                curr.yLabel = prev.yLabel + LABELS_MIN_GAP;
            }
        }

        // Push up if pushed too far out of bounds
        const MAX_Y = 165;
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

    let donutDrawOffset = 0;

    // ── AREA CHART data generation ──
    const areaPaths = useMemo(() => {
        const heightsByType: Record<string, number[]> = {};

        AREA_TYPES.forEach(type => {
            heightsByType[type] = new Array(NUM_POINTS).fill(0);
        });

        data.timelineSegments.forEach(seg => {
            const centerX = (seg.startPercent + seg.widthPercent / 2) / 100;
            const sigma = Math.max(seg.widthPercent, 3) / 100 * 1.2;
            const peakHeight = 0.3 + Math.min(seg.widthPercent / 8, 0.7);

            for (let i = 0; i < NUM_POINTS; i++) {
                const x = i / (NUM_POINTS - 1);
                const dist = x - centerX;
                const value = peakHeight * Math.exp(-dist * dist / (2 * sigma * sigma));
                heightsByType[seg.type][i] += value;
            }
        });

        const maxH = Math.max(
            ...Object.values(heightsByType).flatMap(h => h),
            0.01
        );

        const paths: { type: ActivityType; path: string }[] = [];

        AREA_TYPES.forEach(type => {
            const heights = heightsByType[type];
            if (heights.every(h => h === 0)) return;

            let d = `M 0 ${SVG_H}`;
            for (let i = 0; i < NUM_POINTS; i++) {
                const x = (i / (NUM_POINTS - 1)) * SVG_W;
                const y = SVG_H - (heights[i] / maxH) * SVG_H * 0.82;
                d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }
            d += ` L ${SVG_W} ${SVG_H} Z`;

            paths.push({ type, path: d });
        });

        return paths;
    }, [data.timelineSegments]);

    return (
        <div className={styles.card}>
            <h3 className={styles.chartTitle}>{data.date}, {data.department}, {data.employeeName}</h3>

            <div className={styles.chartArea}>
                {/* ── DONUT CHART ── */}
                <div className={styles.donutColumn}>
                    <div className={styles.svgWrapper}>
                        <svg viewBox="0 0 160 160" className={styles.donutSvg}>
                            <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#edf1f7" strokeWidth="20" />
                            {data.donutSegments.map((seg) => {
                                const info = labelsInfo.find(l => l.seg.type === seg.type)!;
                                const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`;
                                const dashoffset = (circumference * 0.25) - ((donutDrawOffset / 100) * circumference);
                                donutDrawOffset += seg.percent;

                                const isDimmed = hoveredType && hoveredType !== seg.type;

                                const { x1, y1, xBend, yBend, xLabelStart, yLabel, isLeft } = info;
                                const xLabelMid = xLabelStart + (isLeft ? 8 : -8);

                                return (
                                    <React.Fragment key={seg.type}>
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r={radius}
                                            fill="transparent"
                                            stroke={colorMap[seg.type]}
                                            strokeWidth="20"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={dashoffset}
                                            className={classNames(styles.donutSegment, { [styles.dimmed]: isDimmed })}
                                            onMouseEnter={() => setHoveredType(seg.type)}
                                            onMouseLeave={() => setHoveredType(null)}
                                            style={{ transition: 'opacity 0.2s', strokeLinecap: 'butt' }}
                                        />
                                        <polyline
                                            points={`${x1},${y1} ${xBend},${yBend} ${xLabelMid},${yLabel} ${xLabelStart},${yLabel}`}
                                            className={classNames(styles.donutPolyline, { [styles.dimmed]: isDimmed })}
                                        />
                                        <text
                                            x={xLabelStart + (isLeft ? -4 : 4)}
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

                {/* ── AREA CHART (replaces bar timeline visually) ── */}
                <div className={styles.timelineColumn}>
                    <div className={styles.areaChartWrapper}>
                        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className={styles.areaChartSvg} preserveAspectRatio="none">
                            {areaPaths.map(({ type, path }) => (
                                <path
                                    key={type}
                                    d={path}
                                    fill={colorMap[type]}
                                    className={classNames(styles.areaPath, { [styles.dimmed]: hoveredType && hoveredType !== type })}
                                    opacity={0.65}
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
                            <div>{t('activity.timeline.legend.idle')}</div>
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
                            <div>{data.stats.idle}</div>
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
