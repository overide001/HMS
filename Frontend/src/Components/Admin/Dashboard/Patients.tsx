import { ScrollArea, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getAllPatients } from '../../../Service/PatientProfileService';
import { bloodGroupMap } from '../../../Data/DropdownData';

// 20 light, solid background colors (orange/pastel theme)
const lightBackgrounds = [
    '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#f97316',
    '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
    '#fff4e6', '#ffe8d9', '#ffddd0', '#ffd2c4', '#ffc7b8',
    '#fff0e6', '#ffe5d9', '#ffd9cc', '#ffcebf', '#ffc3b2',
];

const Patients = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoverBgMap, setHoverBgMap] = useState<Record<string, string>>({});

    useEffect(() => {
        setLoading(true);
        getAllPatients()
            .then((data) => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setPatients(sorted);

                const shuffledColors = [...lightBackgrounds];
                for (let i = shuffledColors.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
                }

                const colorMap: Record<string, string> = {};
                sorted.forEach((patient: any, index: number) => {
                    colorMap[patient.id] = shuffledColors[index % shuffledColors.length];
                });
                setHoverBgMap(colorMap);
            })
            .catch((error) => console.error("Error fetching patients:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <style>{css}</style>
            <div className="patients-wrapper">
                <div className="patients-header">
                    <div className="patients-header-left">
                        <span className="patients-eyebrow">Healthcare</span>
                        <h2 className="patients-title">Patients</h2>
                    </div>
                    <div className="patients-count-pill">
                        <span className="patients-count-num">{patients.length}</span>
                        <span className="patients-count-lbl">registered</span>
                    </div>
                </div>

                <div className="patients-rule" />

                <ScrollArea h={300} type="always" scrollbarSize={6} offsetScrollbars>
                    <div className="patients-list">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="patients-skeleton">
                                    <Skeleton height={80} radius={12} />
                                </div>
                            ))
                        ) : patients.length === 0 ? (
                            <div className="patients-empty">
                                <div className="patients-empty-ring" />
                                <p className="patients-empty-title">No patients</p>
                                <p className="patients-empty-sub">No patients registered yet.</p>
                            </div>
                        ) : (
                            patients.map((patient, i) => {
                                const hoverBg = hoverBgMap[patient.id] || lightBackgrounds[0];
                                const bloodGroup = bloodGroupMap[patient.bloodGroup] || patient.bloodGroup;

                                return (
                                    <div
                                        key={patient.id}
                                        className="patients-card"
                                        style={{
                                            '--hover-bg': hoverBg,
                                            animationDelay: `${i * 0.07}s`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="patients-card-bar" />
                                        <div className="patients-card-left">
                                            <p className="patients-card-name">{patient.name}</p>
                                            <p className="patients-card-email">{patient.email}</p>
                                        </div>
                                        <div className="patients-card-right">
                                            <p className="patients-card-address">{patient.address}</p>
                                            <p className="patients-card-blood">Blood Group: {bloodGroup}</p>
                                        </div>
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

.patients-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #fed7aa;
    box-shadow: 0 2px 8px rgba(249,115,22,0.06), 0 12px 40px rgba(249,115,22,0.08);
    position: relative;
    overflow: hidden;
}
.patients-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(249,115,22,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.patients-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.patients-header-left { display: flex; flex-direction: column; gap: 3px; }
.patients-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f97316;
}
.patients-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.patients-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #f97316, #fdba74);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.patients-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(249,115,22,0.4);
}
.patients-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.patients-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.patients-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(249,115,22,0.15), transparent);
    margin-bottom: 16px;
}

.patients-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-right: 4px;
    padding-bottom: 4px;
}

/* Card */
.patients-card {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
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
.patients-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(249,115,22,0.18), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    border-color: rgba(249,115,22,0.5);
    background: var(--hover-bg, #fff7ed);
}

/* Left bar */
.patients-card-bar {
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
.patients-card:hover .patients-card-bar {
    top: 0;
    bottom: 0;
    width: 5px;
    opacity: 1;
}

/* Left content */
.patients-card-left {
    flex: 1;
    min-width: 0; /* Allows truncation */
    padding-left: 18px;
    z-index: 1;
}
.patients-card-name {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #1e2640;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    display: inline-block;
    transition: color 0.3s ease, font-weight 0.2s ease, letter-spacing 0.35s ease;
}
.patients-card-name::after {
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
.patients-card:hover .patients-card-name {
    color: #f97316;
    font-weight: 800;
    letter-spacing: 0em;
}
.patients-card:hover .patients-card-name::after {
    width: 100%;
}

.patients-card-email {
    margin: 4px 0 0;
    font-size: 12px;
    color: #94a3c4;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), text-decoration 0.2s ease;
}
.patients-card:hover .patients-card-email {
    color: #475569;
    font-weight: 600;
    transform: translateX(2px);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: #f97316;
    text-underline-offset: 2px;
}

/* Right content */
.patients-card-right {
    max-width: 45%;
    text-align: right;
    margin-right: 12px;
    z-index: 1;
}
.patients-card-address,
.patients-card-blood {
    font-size: 12px;
    font-weight: 500;
    color: #94a3c4;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    margin: 0;
    word-break: break-word;
    white-space: normal;
}
.patients-card-blood {
    margin-top: 4px;
}
.patients-card:hover .patients-card-address,
.patients-card:hover .patients-card-blood {
    color: #f97316;
    font-weight: 700;
    transform: translateY(-1px);
}

/* Skeleton */
.patients-skeleton {
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.patients-skeleton .mantine-Skeleton-root {
    background: #fef3c7;
    border-radius: 12px;
}

/* Empty */
.patients-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.patients-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #fdba74;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.patients-empty-title { margin: 0; font-size: 15px; font-weight: 700; color: #64748b; }
.patients-empty-sub   { margin: 0; font-size: 12.5px; color: #94a3b8; }
`;

export default Patients;