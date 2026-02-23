import React, { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './DayDetailsChart.module.scss';

export type ActivityType = 'productive' | 'neutral' | 'unproductive' | 'uncategorized' | 'idle';

export interface TimeSegment {
    id: string;
    type: ActivityType;
    startPercent: number; // 0 to 100 representing 08:00 to 19:00
    widthPercent: number; // width based on duration
    tooltipTime: string; // e.g., "16:45 - 17:00"
}

export interface DayActivityData {
    employeeName: string;
    date: string;
    department: string;

    // Donut chart stats
    donutSegments: {
        type: ActivityType;
        percent: number;
        duration: string;
    }[];

    // Timeline bars (can be multiple rows or overlapping, based on screenshot they seem like one timeline with small clusters)
    timelineSegments: TimeSegment[];

    // Table data
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

export const DayDetailsChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const [hoveredType, setHoveredType] = useState<ActivityType | null>(null);

    const getLabel = (type: ActivityType) => t(`activity.timeline.legend.${type}`);

    // SVG Donut calculation helpers
    const radius = 55;
    const circumference = 2 * Math.PI * radius;

    // Pre-calculate label positions to avoid overlap
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

    return (
        <div className={styles.card}>
            <div className={styles.chartArea}>
                {/* DONUT CHART */}
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

                {/* TIMELINE CHART */}
                <div className={styles.timelineColumn}>
                    <h3 className={styles.chartTitle}>{data.date}, {data.department}, {data.employeeName}</h3>

                    <div className={styles.timelineWrapper}>
                        {/* Hour markers */}
                        <div className={styles.hourMarkers}>
                            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour) => (
                                <div key={hour} className={styles.hourMark}>
                                    <div className={styles.tick} />
                                    <span className={styles.hourLabel}>{hour.toString().padStart(2, '0')}</span>
                                    {/* Red dotted lines for bounds based on screenshot (9:00 and 18:00) */}
                                    {(hour === 9 || hour === 18) && (
                                        <>
                                            <div className={styles.redDottedLine} />
                                            <span className={styles.redTimeLabel}>{hour}:00</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Bar area */}
                        <div className={styles.barArea}>
                            {data.timelineSegments.map(seg => (
                                <div
                                    key={seg.id}
                                    className={classNames(styles.timeSegment, { [styles.dimmed]: hoveredType && hoveredType !== seg.type })}
                                    style={{
                                        left: `${seg.startPercent}%`,
                                        width: `${Math.max(0.5, seg.widthPercent)}%`, // Ensure minimum visible width
                                        backgroundColor: colorMap[seg.type]
                                    }}
                                    title={`${getLabel(seg.type)}: ${seg.tooltipTime}`}
                                    onMouseEnter={() => setHoveredType(seg.type)}
                                    onMouseLeave={() => setHoveredType(null)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* DATA TABLE */}
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
