import { ScrollArea, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getTodaysAppointments } from '../../../Service/AppointmentService';
import { extractTimeIn12HourFormat } from '../../../Utility/DateUtitlity';

// 20 light, solid background colors (violet/purple theme)
const lightBackgrounds = [
    '#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa',
    '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc',
    '#faf9ff', '#f0eaff', '#e6dcff', '#dccfff', '#d2c2ff',
    '#f8f4ff', '#f0eaff', '#e8dfff', '#e0d5ff', '#d8cbff',
];

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoverBgMap, setHoverBgMap] = useState<Record<string, string>>({});

    useEffect(() => {
        setLoading(true);
        getTodaysAppointments()
            .then((res) => {
                // Sort by time ascending (earliest first)
                const sorted = [...res].sort((a, b) =>
                    new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
                );
                setAppointments(sorted);

                // Shuffle background colors for variety
                const shuffledColors = [...lightBackgrounds];
                for (let i = shuffledColors.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
                }

                const colorMap: Record<string, string> = {};
                sorted.forEach((app: any, index: number) => {
                    colorMap[app.id] = shuffledColors[index % shuffledColors.length];
                });
                setHoverBgMap(colorMap);
            })
            .catch((err) => console.error("Error fetching today's appointments:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <style>{css}</style>
            <div className="today-app-wrapper">
                <div className="today-app-header">
                    <div className="today-app-header-left">
                        <span className="today-app-eyebrow">Schedule</span>
                        <h2 className="today-app-title">Today's Appointments</h2>
                    </div>
                    <div className="today-app-count-pill">
                        <span className="today-app-count-num">{appointments.length}</span>
                        <span className="today-app-count-lbl">today</span>
                    </div>
                </div>

                <div className="today-app-rule" />

                <ScrollArea h={300} type="always" scrollbarSize={6} offsetScrollbars>
                    <div className="today-app-list">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="today-app-skeleton">
                                    <Skeleton height={80} radius={12} />
                                </div>
                            ))
                        ) : appointments.length === 0 ? (
                            <div className="today-app-empty">
                                <div className="today-app-empty-ring" />
                                <p className="today-app-empty-title">No appointments</p>
                                <p className="today-app-empty-sub">No appointments scheduled for today.</p>
                            </div>
                        ) : (
                            appointments.map((app, i) => {
                                const hoverBg = hoverBgMap[app.id] || lightBackgrounds[0];
                                return (
                                    <div
                                        key={app.id}
                                        className="today-app-card"
                                        style={{
                                            '--hover-bg': hoverBg,
                                            animationDelay: `${i * 0.07}s`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="today-app-card-bar" />
                                        <div className="today-app-card-left">
                                            <p className="today-app-card-patient">{app.patientName}</p>
                                            <p className="today-app-card-doctor">Dr. {app.doctorName}</p>
                                        </div>
                                        <div className="today-app-card-right">
                                            <p className="today-app-card-time">
                                                {extractTimeIn12HourFormat(app.appointmentTime)}
                                            </p>
                                            <p className="today-app-card-reason">{app.reason}</p>
                                        </div>
                                        <div className="today-app-card-arrow">→</div>
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

.today-app-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #ddd6fe;
    box-shadow: 0 2px 8px rgba(139,92,246,0.06), 0 12px 40px rgba(139,92,246,0.08);
    position: relative;
    overflow: hidden;
}
.today-app-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(139,92,246,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.today-app-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.today-app-header-left { display: flex; flex-direction: column; gap: 3px; }
.today-app-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8b5cf6;
}
.today-app-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.today-app-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #8b5cf6, #c4b5fd);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(139,92,246,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.today-app-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(139,92,246,0.4);
}
.today-app-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.today-app-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.today-app-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(139,92,246,0.15), transparent);
    margin-bottom: 16px;
}

.today-app-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-right: 4px;
    padding-bottom: 4px;
}

/* Card */
.today-app-card {
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
.today-app-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(139,92,246,0.18), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    border-color: rgba(139,92,246,0.5);
    background: var(--hover-bg, #faf5ff);
}

/* Left bar */
.today-app-card-bar {
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
.today-app-card:hover .today-app-card-bar {
    top: 0;
    bottom: 0;
    width: 5px;
    opacity: 1;
}

/* Left content */
.today-app-card-left {
    flex: 1;
    padding-left: 18px;
    min-width: 0;
    z-index: 1;
}
.today-app-card-patient {
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
.today-app-card-patient::after {
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
.today-app-card:hover .today-app-card-patient {
    color: #8b5cf6;
    font-weight: 800;
    letter-spacing: 0em;
}
.today-app-card:hover .today-app-card-patient::after {
    width: 100%;
}

.today-app-card-doctor {
    margin: 4px 0 0;
    font-size: 12px;
    color: #94a3c4;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), text-decoration 0.2s ease;
}
.today-app-card:hover .today-app-card-doctor {
    color: #475569;
    font-weight: 600;
    transform: translateX(2px);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: #8b5cf6;
    text-underline-offset: 2px;
}

/* Right content */
.today-app-card-right {
    text-align: right;
    margin-right: 12px;
    z-index: 1;
}
.today-app-card-time,
.today-app-card-reason {
    font-size: 12px;
    font-weight: 500;
    color: #94a3c4;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    margin: 0;
}
.today-app-card-reason {
    margin-top: 4px;
}
.today-app-card:hover .today-app-card-time,
.today-app-card:hover .today-app-card-reason {
    color: #8b5cf6;
    font-weight: 700;
    transform: translateY(-1px);
}

/* Arrow */
.today-app-card-arrow {
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
.today-app-card:hover .today-app-card-arrow {
    transform: translateX(0);
    opacity: 1;
    color: #8b5cf6;
}

/* Skeleton */
.today-app-skeleton {
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.today-app-skeleton .mantine-Skeleton-root {
    background: #ede9fe;
    border-radius: 12px;
}

/* Empty */
.today-app-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.today-app-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #c4b5fd;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.today-app-empty-title { margin: 0; font-size: 15px; font-weight: 700; color: #64748b; }
.today-app-empty-sub   { margin: 0; font-size: 12.5px; color: #94a3b8; }
`;

export default Appointments;