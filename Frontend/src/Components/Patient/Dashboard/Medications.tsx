import { ScrollArea, Skeleton, Card, Text, Badge, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMedicinesConsumedByPatient } from '../../../Service/AppointmentService';

// 20 light, solid background colors (orange/pastel theme)
const lightBackgrounds = [
    '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#f97316',
    '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
    '#fff4e6', '#ffe8d9', '#ffddd0', '#ffd2c4', '#ffc7b8',
    '#fff0e6', '#ffe5d9', '#ffd9cc', '#ffcebf', '#ffc3b2',
];

const Medications = () => {
    const user = useSelector((state: any) => state.user);
    const [medications, setMedications] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoverBgMap, setHoverBgMap] = useState<Record<string, string>>({});

    useEffect(() => {
        setLoading(true);
        getMedicinesConsumedByPatient(user.profileId)
            .then((res) => {
                // Sort alphabetically by name
                const sorted = [...res].sort((a, b) => a.name.localeCompare(b.name));
                setMedications(sorted);

                // Assign random background colors (shuffle and cycle)
                const shuffledColors = [...lightBackgrounds];
                for (let i = shuffledColors.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
                }

                const colorMap: Record<string, string> = {};
                sorted.forEach((med: any, index: number) => {
                    colorMap[med.id] = shuffledColors[index % shuffledColors.length];
                });
                setHoverBgMap(colorMap);
            })
            .catch((err) => console.error("Error fetching medications:", err))
            .finally(() => setLoading(false));
    }, [user.profileId]);

    return (
        <>
            <style>{css}</style>
            <div className="med-wrapper">
                <div className="med-header">
                    <div className="med-header-left">
                        <span className="med-eyebrow">Prescriptions</span>
                        <h2 className="med-title">Medications</h2>
                    </div>
                    <div className="med-count-pill">
                        <span className="med-count-num">{medications.length}</span>
                        <span className="med-count-lbl">active</span>
                    </div>
                </div>

                <div className="med-rule" />

                <ScrollArea h={300} type="always" scrollbarSize={6} offsetScrollbars>
                    <div className="med-list">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="med-skeleton">
                                    <Skeleton height={80} radius={12} />
                                </div>
                            ))
                        ) : medications.length === 0 ? (
                            <div className="med-empty">
                                <div className="med-empty-ring" />
                                <p className="med-empty-title">No medications</p>
                                <p className="med-empty-sub">No prescribed medicines found.</p>
                            </div>
                        ) : (
                            medications.map((med, i) => {
                                const hoverBg = hoverBgMap[med.id] || lightBackgrounds[0];
                                return (
                                    <div
                                        key={med.id}
                                        className="med-card"
                                        style={{
                                            '--hover-bg': hoverBg,
                                            animationDelay: `${i * 0.07}s`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="med-card-bar" />
                                        <div className="med-card-body">
                                            <div className="med-card-top">
                                                <p className="med-card-name">{med.name}</p>
                                                <Badge color="orange" variant="light" size="sm">
                                                    {med.dosage}
                                                </Badge>
                                            </div>
                                            <p className="med-card-manufacturer">{med.manufacturer}</p>
                                            <div className="med-card-meta">
                                                <span className="med-card-frequency">{med.frequency}</span>
                                            </div>
                                        </div>
                                        <div className="med-card-arrow">→</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.med-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #fde68a;
    box-shadow: 0 2px 8px rgba(249,115,22,0.06), 0 12px 40px rgba(249,115,22,0.08);
    position: relative;
    overflow: hidden;
}
.med-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(249,115,22,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.med-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.med-header-left { display: flex; flex-direction: column; gap: 3px; }
.med-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f97316;
}
.med-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.med-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #f97316, #fdba74);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.med-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(249,115,22,0.4);
}
.med-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.med-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.med-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(249,115,22,0.15), transparent);
    margin-bottom: 16px;
}

.med-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-right: 4px;
    padding-bottom: 4px;
}

/* Card */
.med-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fef9f0;
    border: 1px solid #fed7aa;
    border-radius: 16px;
    padding: 13px 14px 13px 0;
    cursor: pointer;
    overflow: hidden;
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition:
        transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.35s ease,
        background 0.35s ease;
}
@keyframes cardIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.med-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(249,115,22,0.18), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    border-color: rgba(249,115,22,0.5);
    background: var(--hover-bg, #fff7ed);
}

/* Left bar */
.med-card-bar {
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #f97316, #fdba74);
    opacity: 0.5;
    z-index: 1;
    transition:
        top 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.35s ease;
}
.med-card:hover .med-card-bar {
    top: 0;
    bottom: 0;
    width: 5px;
    opacity: 1;
}

/* Card body */
.med-card-body {
    flex: 1;
    min-width: 0;
    z-index: 1;
}
.med-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}
.med-card-name {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1e2640;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    transition: color 0.3s ease, font-weight 0.2s ease, letter-spacing 0.35s ease;
}
.med-card-name::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #f97316, #fdba74);
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.med-card:hover .med-card-name {
    color: #f97316;
    font-weight: 800;
    letter-spacing: 0em;
}
.med-card:hover .med-card-name::after {
    width: 100%;
}

.med-card-manufacturer {
    margin: 0 0 7px;
    font-size: 12px;
    color: #94a3c4;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), text-decoration 0.2s ease;
}
.med-card:hover .med-card-manufacturer {
    color: #475569;
    font-weight: 600;
    transform: translateX(2px);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: #f97316;
    text-underline-offset: 2px;
}

.med-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
}
.med-card-frequency {
    font-size: 11px;
    font-weight: 600;
    color: #b0bcd4;
    letter-spacing: 0.01em;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.med-card:hover .med-card-frequency {
    color: #f97316;
    font-weight: 700;
    transform: translateY(-1px);
}

/* Arrow */
.med-card-arrow {
    color: #d1d9ef;
    flex-shrink: 0;
    z-index: 1;
    transform: translateX(-6px);
    opacity: 0;
    transition:
        transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.35s ease,
        color 0.3s ease;
    font-size: 18px;
    font-weight: 500;
}
.med-card:hover .med-card-arrow {
    transform: translateX(0);
    opacity: 1;
    color: #f97316;
}

/* Skeleton */
.med-skeleton {
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.med-skeleton .mantine-Skeleton-root {
    background: #fef3c7;
    border-radius: 12px;
}

/* Empty */
.med-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.med-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #fdba74;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.med-empty-title { margin: 0; font-size: 15px; font-weight: 700; color: #64748b; }
.med-empty-sub   { margin: 0; font-size: 12.5px; color: #94a3b8; }
`;

export default Medications;