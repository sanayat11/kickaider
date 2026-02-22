import React, { useState } from 'react';
import classNames from 'classnames';
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

const labelMap: Record<ActivityType, string> = {
    productive: 'Продуктивно',
    neutral: 'Нейтрально',
    unproductive: 'Непродуктивно',
    uncategorized: 'Без категории',
    idle: 'Бездействие',
};

export const DayDetailsChart: React.FC<Props> = ({ data }) => {
    const [hoveredType, setHoveredType] = useState<ActivityType | null>(null);

    // SVG Donut calculation helpers
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let donutOffset = 0;

    return (
        <div className={styles.card}>
            <div className={styles.chartArea}>
                {/* DONUT CHART */}
                <div className={styles.donutColumn}>
                    <div className={styles.svgWrapper}>
                        <svg viewBox="0 0 160 160" className={styles.donutSvg}>
                            <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#edf1f7" strokeWidth="20" />
                            {data.donutSegments.map((seg) => {
                                const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`;
                                const dashoffset = (circumference * 0.25) - ((donutOffset / 100) * circumference);
                                
                                const midP = donutOffset + seg.percent / 2;
                                donutOffset += seg.percent;

                                const isDimmed = hoveredType && hoveredType !== seg.type;

                                // Label geometry
                                const angle = (midP / 100) * 2 * Math.PI - Math.PI / 2;
                                const x1 = 80 + radius * Math.cos(angle);
                                const y1 = 80 + radius * Math.sin(angle);
                                const x2 = 80 + (radius + 15) * Math.cos(angle);
                                const y2 = 80 + (radius + 15) * Math.sin(angle);
                                const isLeft = Math.cos(angle) < 0;
                                const x3 = x2 + (isLeft ? -10 : 10);
                                const y3 = y2;

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
                                        {/* pointer line */}
                                        <polyline 
                                            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} 
                                            className={classNames(styles.donutPolyline, { [styles.dimmed]: isDimmed })} 
                                        />
                                        <text
                                            x={x3 + (isLeft ? -4 : 4)}
                                            y={y3 + 4}
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
                                {labelMap[seg.type]}
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
                                    title={`${labelMap[seg.type]}: ${seg.tooltipTime}`}
                                    onMouseEnter={() => setHoveredType(seg.type)}
                                    onMouseLeave={() => setHoveredType(null)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* DATA TABLE */}
                    <div className={styles.statsTable}>
                        <div className={styles.tableRowHeader}>
                            <div>Бездействие</div>
                            <div>Активность</div>
                            <div>Продуктивно</div>
                            <div>Непродуктивно</div>
                            <div>Нейтрально</div>
                            <div>Без категории</div>
                            <div>Первая активность</div>
                            <div>Последняя активность</div>
                            <div>Время на работе</div>
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
