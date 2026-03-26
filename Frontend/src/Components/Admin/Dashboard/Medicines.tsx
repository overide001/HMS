import { ScrollArea, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getAllMedicines } from '../../../Service/MedicineService';

// 20 light, solid background colors (orange/pastel theme)
const lightBackgrounds = [
    '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#f97316',
    '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
    '#fff4e6', '#ffe8d9', '#ffddd0', '#ffd2c4', '#ffc7b8',
    '#fff0e6', '#ffe5d9', '#ffd9cc', '#ffcebf', '#ffc3b2',
];

const Medicines = () => {
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoverBgMap, setHoverBgMap] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        getAllMedicines()
            .then((res) => {
                // Sort alphabetically by name
                const sorted = [...res].sort((a, b) => a.name.localeCompare(b.name));
                setMedicines(sorted);

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
            .catch((err) => console.error("Error fetching medicines:", err))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <style>{css}</style>
            <div className="medicines-wrapper">
                <div className="medicines-header">
                    <div className="medicines-header-left">
                        <span className="medicines-eyebrow">Pharmacy</span>
                        <h2 className="medicines-title">Medicines</h2>
                    </div>
                    <div className="medicines-count-pill">
                        <span className="medicines-count-num">{medicines.length}</span>
                        <span className="medicines-count-lbl">available</span>
                    </div>
                </div>

                <div className="medicines-rule" />

                <ScrollArea h={300} type="always" scrollbarSize={6} offsetScrollbars>
                    <div className="medicines-list">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="medicines-skeleton">
                                    <Skeleton height={80} radius={12} />
                                </div>
                            ))
                        ) : medicines.length === 0 ? (
                            <div className="medicines-empty">
                                <div className="medicines-empty-ring" />
                                <p className="medicines-empty-title">No medicines</p>
                                <p className="medicines-empty-sub">No medicines available in the system.</p>
                            </div>
                        ) : (
                            medicines.map((med, i) => {
                                const hoverBg = hoverBgMap[med.id] || lightBackgrounds[0];
                                return (
                                    <div
                                        key={med.id}
                                        className="medicines-card"
                                        style={{
                                            '--hover-bg': hoverBg,
                                            animationDelay: `${i * 0.07}s`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="medicines-card-bar" />
                                        <div className="medicines-card-left">
                                            <p className="medicines-card-name">{med.name}</p>
                                            <p className="medicines-card-manufacturer">{med.manufacturer}</p>
                                        </div>
                                        <div className="medicines-card-right">
                                            <p className="medicines-card-dosage">{med.dosage}</p>
                                            <p className="medicines-card-stock">Stock: {med.stock}</p>
                                        </div>
                                        <div className="medicines-card-arrow">→</div>
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

.medicines-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #fed7aa;
    box-shadow: 0 2px 8px rgba(249,115,22,0.06), 0 12px 40px rgba(249,115,22,0.08);
    position: relative;
    overflow: hidden;
}
.medicines-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(249,115,22,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.medicines-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.medicines-header-left { display: flex; flex-direction: column; gap: 3px; }
.medicines-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f97316;
}
.medicines-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.medicines-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #f97316, #fdba74);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.medicines-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(249,115,22,0.4);
}
.medicines-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.medicines-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.medicines-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(249,115,22,0.15), transparent);
    margin-bottom: 16px;
}

.medicines-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-right: 4px;
    padding-bottom: 4px;
}

/* Card */
.medicines-card {
    position: relative;
    display: flex;
    align-items: center;
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
.medicines-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(249,115,22,0.18), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    border-color: rgba(249,115,22,0.5);
    background: var(--hover-bg, #fff7ed);
}

/* Left bar */
.medicines-card-bar {
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
.medicines-card:hover .medicines-card-bar {
    top: 0;
    bottom: 0;
    width: 5px;
    opacity: 1;
}

/* Left content */
.medicines-card-left {
    flex: 1;
    padding-left: 18px;
    min-width: 0;
    z-index: 1;
}
.medicines-card-name {
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
.medicines-card-name::after {
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
.medicines-card:hover .medicines-card-name {
    color: #f97316;
    font-weight: 800;
    letter-spacing: 0em;
}
.medicines-card:hover .medicines-card-name::after {
    width: 100%;
}

.medicines-card-manufacturer {
    margin: 4px 0 0;
    font-size: 12px;
    color: #94a3c4;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), text-decoration 0.2s ease;
}
.medicines-card:hover .medicines-card-manufacturer {
    color: #475569;
    font-weight: 600;
    transform: translateX(2px);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: #f97316;
    text-underline-offset: 2px;
}

/* Right content */
.medicines-card-right {
    text-align: right;
    margin-right: 12px;
    z-index: 1;
}
.medicines-card-dosage,
.medicines-card-stock {
    font-size: 12px;
    font-weight: 500;
    color: #94a3c4;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    margin: 0;
}
.medicines-card-stock {
    margin-top: 4px;
}
.medicines-card:hover .medicines-card-dosage,
.medicines-card:hover .medicines-card-stock {
    color: #f97316;
    font-weight: 700;
    transform: translateY(-1px);
}

/* Arrow */
.medicines-card-arrow {
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
.medicines-card:hover .medicines-card-arrow {
    transform: translateX(0);
    opacity: 1;
    color: #f97316;
}

/* Skeleton */
.medicines-skeleton {
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.medicines-skeleton .mantine-Skeleton-root {
    background: #fef3c7;
    border-radius: 12px;
}

/* Empty */
.medicines-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.medicines-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #fdba74;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.medicines-empty-title { margin: 0; font-size: 15px; font-weight: 700; color: #64748b; }
.medicines-empty-sub   { margin: 0; font-size: 12.5px; color: #94a3b8; }
`;

export default Medicines;