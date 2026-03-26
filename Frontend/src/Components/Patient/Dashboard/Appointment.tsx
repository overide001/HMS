import { ScrollArea, Skeleton } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAppointmentsByPatient } from '../../../Service/AppointmentService';
import { extractTimeIn12HourFormat, formatDate } from '../../../Utility/DateUtitlity';

const lightBackgrounds = [
    '#f0fdf4', '#fef9c3', '#fce7f3', '#f3e8ff', '#eff6ff',
    '#fffbeb', '#ecfdf5', '#eef2ff', '#fff7ed', '#f7fee7',
    '#ecfeff', '#e0f2fe', '#f5f3ff', '#ffe4e6', '#fae8ff',
    '#f0fdfa', '#f9fafb', '#fef2f2', '#eff6ff', '#f0fdf4',
];

const Appointments = () => {
    const user = useSelector((state: any) => state.user);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoverBgMap, setHoverBgMap] = useState<Record<string, string>>({});

    const getStatusInfo = (appointmentTime: string) => {
        const now = new Date();
        const appDate = new Date(appointmentTime);
        if (appDate < now) return { label: 'Completed', cls: 'status-completed', priority: 3 };
        if (appDate.toDateString() === now.toDateString()) return { label: 'Today', cls: 'status-today', priority: 2 };
        return { label: 'Upcoming', cls: 'status-upcoming', priority: 1 };
    };

    useEffect(() => {
        setLoading(true);
        getAppointmentsByPatient(user.profileId)
            .then((res) => {
                const sorted = [...res].sort((a, b) => {
                    const statusA = getStatusInfo(a.appointmentTime);
                    const statusB = getStatusInfo(b.appointmentTime);
                    if (statusA.priority !== statusB.priority) return statusA.priority - statusB.priority;
                    return new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime();
                });
                setAppointments(sorted);

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
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user.profileId]);

    const getStatus = (appointmentTime: string) => {
        const { label, cls } = getStatusInfo(appointmentTime);
        return { label, cls };
    };

    return (
        <>
            <style>{css}</style>
            <div className="appt-wrapper">
                <div className="appt-header">
                    <div className="appt-header-left">
                        <span className="appt-eyebrow">Patient Portal</span>
                        <h2 className="appt-title">Appointments</h2>
                    </div>
                    <div className="appt-count-pill">
                        <span className="appt-count-num">{appointments.length}</span>
                        <span className="appt-count-lbl">scheduled</span>
                    </div>
                </div>

                <div className="appt-rule" />

                {/* ScrollArea with hidden scrollbar but fully functional scroll */}
                <ScrollArea h={300} type="always" scrollbarSize={6} offsetScrollbars>
                    <div className="appt-list">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="appt-skeleton">
                                    <Skeleton height={60} radius={12} />
                                </div>
                            ))
                        ) : appointments.length === 0 ? (
                            <div className="appt-empty">
                                <div className="appt-empty-ring" />
                                <p className="appt-empty-title">No appointments</p>
                                <p className="appt-empty-sub">Book one from the dashboard.</p>
                            </div>
                        ) : (
                            appointments.map((app, i) => {
                                const status = getStatus(app.appointmentTime);
                                const initials =
                                    app.doctorName
                                        ?.split(' ')
                                        .slice(0, 2)
                                        .map((w: string) => w[0])
                                        .join('')
                                        .toUpperCase() ?? 'DR';
                                const hoverBg = hoverBgMap[app.id] || lightBackgrounds[0];

                                return (
                                    <div
                                        key={app.id}
                                        className="appt-card"
                                        style={{
                                            '--hover-bg': hoverBg,
                                            animationDelay: `${i * 0.07}s`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="card-bar" />
                                        <div className="card-avatar">
                                            <span className="card-avatar-text">{initials}</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-top">
                                                <p className="card-doctor">Dr. {app.doctorName}</p>
                                                <span className={`card-badge ${status.cls}`}>{status.label}</span>
                                            </div>
                                            <p className="card-reason">{app.reason || 'General Consultation'}</p>
                                            <div className="card-meta">
                                                <span className="card-meta-date">{formatDate(app.appointmentTime)}</span>
                                                <span className="card-meta-sep" />
                                                <span className="card-meta-time">{extractTimeIn12HourFormat(app.appointmentTime)}</span>
                                            </div>
                                        </div>
                                        <div className="card-arrow">→</div>
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

.appt-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #e8edf8;
    box-shadow: 0 2px 8px rgba(79,90,200,0.06), 0 12px 40px rgba(79,90,200,0.08);
    position: relative;
    overflow: hidden;
}
.appt-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(109,120,255,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.appt-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.appt-header-left { display: flex; flex-direction: column; gap: 3px; }
.appt-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a0aec8;
}
.appt-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.appt-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #4f5aef, #7c83f5);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(79,90,239,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.appt-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(79,90,239,0.4);
}
.appt-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.appt-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.appt-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(79,90,239,0.15), transparent);
    margin-bottom: 16px;
}

.appt-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-right: 4px;
    padding-bottom: 4px;
}

/* ── Card shell ── */
.appt-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fafbff;
    border: 1px solid #e8edf5;
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
.appt-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(79,90,239,0.18), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    border-color: rgba(99,110,245,0.5);
    background: var(--hover-bg, #f7f8ff);
}

/* Left bar */
.card-bar {
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #6366f1, #a78bfa);
    opacity: 0.5;
    z-index: 1;
    transition:
        top 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.35s ease;
}
.appt-card:hover .card-bar {
    top: 0;
    bottom: 0;
    width: 5px;
    opacity: 1;
}

/* Avatar */
.card-avatar {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 14px;
    z-index: 1;
    transition:
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        border-radius 0.35s ease,
        background 0.35s ease,
        box-shadow 0.35s ease;
}
.appt-card:hover .card-avatar {
    transform: scale(1.12) rotate(-6deg);
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
}
.card-avatar-text {
    font-size: 14px;
    font-weight: 700;
    color: #4f46e5;
    letter-spacing: -0.01em;
    position: relative;
    z-index: 2;
    transition: color 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.appt-card:hover .card-avatar-text {
    color: #ffffff;
    transform: scale(1.05);
}

/* Card body */
.card-body {
    flex: 1;
    min-width: 0;
    z-index: 1;
}
.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

/* Doctor name */
.card-doctor {
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
.card-doctor::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #6366f1, #a78bfa);
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.appt-card:hover .card-doctor {
    color: #4f46e5;
    font-weight: 800;
    letter-spacing: 0em;
}
.appt-card:hover .card-doctor::after {
    width: 100%;
}

/* Badge */
.card-badge {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    border-radius: 20px;
    padding: 3px 10px;
    border: 1px solid transparent;
    flex-shrink: 0;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
}
.status-completed { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.status-today     { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.status-upcoming  { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; }
.appt-card:hover .card-badge {
    transform: translateY(-2px) scale(1.06);
    box-shadow: 0 3px 10px rgba(79,90,239,0.15);
}

/* Reason */
.card-reason {
    margin: 0 0 7px;
    font-size: 12px;
    color: #94a3c4;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), text-decoration 0.2s ease;
}
.appt-card:hover .card-reason {
    color: #475569;
    font-weight: 600;
    transform: translateX(2px);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: #818cf8;
    text-underline-offset: 2px;
}

/* Meta */
.card-meta { display: flex; align-items: center; gap: 8px; }
.card-meta-date,
.card-meta-time {
    font-size: 11px;
    font-weight: 600;
    color: #b0bcd4;
    letter-spacing: 0.01em;
    transition: color 0.3s ease, font-weight 0.2s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.card-meta-time { transition-delay: 0.04s; }
.appt-card:hover .card-meta-date,
.appt-card:hover .card-meta-time {
    color: #4f46e5;
    font-weight: 700;
    transform: translateY(-1px);
}
.card-meta-sep {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #d1d9ef;
    flex-shrink: 0;
    transition: background 0.3s ease, transform 0.3s ease;
}
.appt-card:hover .card-meta-sep { background: #a5b4fc; transform: scale(1.5); }

/* Arrow */
.card-arrow {
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
.appt-card:hover .card-arrow { transform: translateX(0); opacity: 1; color: #6366f1; }

/* Skeleton */
.appt-skeleton {
    animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.appt-skeleton .mantine-Skeleton-root {
    background: #eef2ff;
    border-radius: 12px;
}

/* Empty */
.appt-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.appt-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #c7d2fe;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.appt-empty-title { margin: 0; font-size: 15px; font-weight: 700; color: #64748b; }
.appt-empty-sub   { margin: 0; font-size: 12.5px; color: #94a3b8; }
`;

export default Appointments;