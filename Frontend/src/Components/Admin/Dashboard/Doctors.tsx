import { ScrollArea, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getAllDoctors } from '../../../Service/DoctorProfileService';

// 20 light, solid background colors (violet/purple theme)
const lightBackgrounds = [
    '#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa',
    '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc',
    '#faf9ff', '#f0eaff', '#e6dcff', '#dccfff', '#d2c2ff',
    '#f8f4ff', '#f0eaff', '#e8dfff', '#e0d5ff', '#d8cbff',
];

const Doctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoverBgMap, setHoverBgMap] = useState<Record<string, string>>({});

    useEffect(() => {
        setLoading(true);
        getAllDoctors()
            .then((data) => {
                // Sort alphabetically by name
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setDoctors(sorted);

                // Assign random background colors (shuffle and cycle)
                const shuffledColors = [...lightBackgrounds];
                for (let i = shuffledColors.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
                }

                const colorMap: Record<string, string> = {};
                sorted.forEach((doc: any, index: number) => {
                    colorMap[doc.id] = shuffledColors[index % shuffledColors.length];
                });
                setHoverBgMap(colorMap);
            })
            .catch((error) => console.error("Error fetching doctors:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <style>{css}</style>
            <div className="doctors-wrapper">
                <div className="doctors-header">
                    <div className="doctors-header-left">
                        <span className="doctors-eyebrow">Medical Staff</span>
                        <h2 className="doctors-title">Doctors</h2>
                    </div>
                    <div className="doctors-count-pill">
                        <span className="doctors-count-num">{doctors.length}</span>
                        <span className="doctors-count-lbl">available</span>
                    </div>
                </div>

                <div className="doctors-rule" />

                <ScrollArea h={300} type="always" scrollbarSize={6} offsetScrollbars>
                    <div className="doctors-list">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="doctors-skeleton">
                                    <Skeleton height={80} radius={12} />
                                </div>
                            ))
                        ) : doctors.length === 0 ? (
                            <div className="doctors-empty">
                                <div className="doctors-empty-ring" />
                                <p className="doctors-empty-title">No doctors</p>
                                <p className="doctors-empty-sub">No doctors available in the system.</p>
                            </div>
                        ) : (
                            doctors.map((doc, i) => {
                                const hoverBg = hoverBgMap[doc.id] || lightBackgrounds[0];
                                return (
                                    <div
                                        key={doc.id}
                                        className="doctors-card"
                                        style={{
                                            '--hover-bg': hoverBg,
                                            animationDelay: `${i * 0.07}s`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="doctors-card-bar" />
                                        <div className="doctors-card-left">
                                            <p className="doctors-card-name">{doc.name}</p>
                                            <p className="doctors-card-email">{doc.email}</p>
                                        </div>
                                        <div className="doctors-card-right">
                                            <p className="doctors-card-address">{doc.address}</p>
                                            <p className="doctors-card-department">{doc.department}</p>
                                        </div>
                                        <div className="doctors-card-arrow">→</div>
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

.doctors-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #ddd6fe;
    box-shadow: 0 2px 8px rgba(139,92,246,0.06), 0 12px 40px rgba(139,92,246,0.08);
    position: relative;
    overflow: hidden;
}
.doctors-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(139,92,246,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.doctors-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.doctors-header-left { display: flex; flex-direction: column; gap: 3px; }
.doctors-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8b5cf6;
}
.doctors-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.doctors-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #8b5cf6, #c4b5fd);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(139,92,246,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.doctors-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(139,92,246,0.4);
}
.doctors-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.doctors-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.doctors-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(139,92,246,0.15), transparent);
    margin-bottom: 16px;
}

.doctors-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-right: 4px;
    padding-bottom: 4px;
}

/* Card */
.doctors-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #faf9ff;
    border: 1px solid #e9d5ff;
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
.doctors-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(139,92,246,0.18), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    border-color: rgba(139,92,246,0.5);
    background: var(--hover-bg, #faf5ff);
}

/* Left bar */
.doctors-card-bar {
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #8b5cf6, #c4b5fd);
    opacity: 0.5;
    z-index: 1;
    transition:
        top 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.35s ease;
}
.doctors-card:hover .doctors-card-bar {
    top: 0;
    bottom: 0;
    width: 5px;
    opacity: 1;
}

/* Left content */
.doctors-card-left {
    flex: 1;
    padding-left: 18px;
    min-width: 0;
    z-index: 1;
}
.doctors-card-name {
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
.doctors-card-name::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #8b5cf6, #c4b5fd);
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.doctors-card:hover .doctors-card-name {
    color: #8b5cf6;
    font-weight: 800;
    letter-spacing: 0em;
}
.doctors-card:hover .doctors-card-name::after {
    width: 100%;
}

.doctors-card-email {
    margin: 4px 0 0;
    font-size: 12px;
    color: #94a3c4;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), text-decoration 0.2s ease;
}
.doctors-card:hover .doctors-card-email {
    color: #475569;
    font-weight: 600;
    transform: translateX(2px);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: #8b5cf6;
    text-underline-offset: 2px;
}

/* Right content */
.doctors-card-right {
    text-align: right;
    margin-right: 12px;
    z-index: 1;
}
.doctors-card-address,
.doctors-card-department {
    font-size: 12px;
    font-weight: 500;
    color: #94a3c4;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    margin: 0;
}
.doctors-card-department {
    margin-top: 4px;
}
.doctors-card:hover .doctors-card-address,
.doctors-card:hover .doctors-card-department {
    color: #8b5cf6;
    font-weight: 700;
    transform: translateY(-1px);
}

/* Arrow */
.doctors-card-arrow {
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
    margin-right: 4px;
}
.doctors-card:hover .doctors-card-arrow {
    transform: translateX(0);
    opacity: 1;
    color: #8b5cf6;
}

/* Skeleton */
.doctors-skeleton {
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.doctors-skeleton .mantine-Skeleton-root {
    background: #ede9fe;
    border-radius: 12px;
}

/* Empty */
.doctors-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.doctors-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #c4b5fd;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.doctors-empty-title { margin: 0; font-size: 15px; font-weight: 700; color: #64748b; }
.doctors-empty-sub   { margin: 0; font-size: 12.5px; color: #94a3b8; }
`;

export default Doctors;