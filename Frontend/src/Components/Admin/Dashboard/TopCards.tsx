import { AreaChart } from '@mantine/charts';
import { ThemeIcon, Skeleton } from '@mantine/core';
import { IconFileReport, IconStethoscope, IconUsers } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { countAllAppointments } from '../../../Service/AppointmentService';
import { addZeroMonths } from '../../../Utility/OtherUtility';
import { getRegistrationCounts } from '../../../Service/UserService';

const TopCards = () => {
    const [apData, setApData] = useState<any[]>([]);
    const [ptData, setPtData] = useState<any[]>([]);
    const [drData, setDrData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            countAllAppointments(),
            getRegistrationCounts()
        ])
            .then(([appointments, registrations]) => {
                setApData(addZeroMonths(appointments, "month", "count"));
                setPtData(addZeroMonths(registrations.patientCounts, "month", "count"));
                setDrData(addZeroMonths(registrations.doctorCounts, "month", "count"));
            })
            .catch((err) => console.error("Error fetching dashboard data:", err))
            .finally(() => setLoading(false));
    }, []);

    const getSum = (data: any[], key: string) => {
        return data.reduce((sum, item) => sum + item[key], 0);
    }

    const card = (name: string, id: string, color: string, bg: string, icon: React.ReactNode, data: any[]) => {
        const total = getSum(data, id);
        const chartData = data.map(item => ({ month: item.month, [id]: item[id] }));

        return (
            <div className={`top-card ${bg}`}>
                <div className="top-card-header">
                    <ThemeIcon size="xl" radius="md" color={color} className="top-card-icon">
                        {icon}
                    </ThemeIcon>
                    <div className="top-card-stats">
                        <span className="top-card-label">{name}</span>
                        <span className="top-card-value">{total}</span>
                    </div>
                </div>
                <AreaChart
                    h={80}
                    data={chartData}
                    dataKey="month"
                    series={[{ name: id, color: color }]}
                    strokeWidth={3}
                    withGradient
                    fillOpacity={0.7}
                    curveType="bump"
                    tickLine="none"
                    gridAxis="none"
                    withXAxis={false}
                    withYAxis={false}
                    withDots={false}
                    className="top-card-chart"
                />
            </div>
        );
    };

    const skeletonCard = () => (
        <div className="top-card top-card-skeleton">
            <div className="top-card-header">
                <Skeleton circle height={48} width={48} />
                <div className="top-card-stats">
                    <Skeleton height={16} width={80} radius="xl" mb={8} />
                    <Skeleton height={28} width={60} radius="xl" />
                </div>
            </div>
            <Skeleton height={80} radius="md" mt="md" />
        </div>
    );

    return (
        <>
            <style>{css}</style>
            <div className="top-cards-grid">
                {loading ? (
                    <>
                        {skeletonCard()}
                        {skeletonCard()}
                        {skeletonCard()}
                    </>
                ) : (
                    <>
                        {card("Appointments", "count", "violet", "bg-violet-50", <IconFileReport />, apData)}
                        {card("Patients", "count", "orange", "bg-orange-50", <IconUsers />, ptData)}
                        {card("Doctors", "count", "green", "bg-green-50", <IconStethoscope />, drData)}
                    </>
                )}
            </div>
        </>
    );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.top-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    font-family: 'Outfit', sans-serif;
}

.top-card {
    background: #ffffff;
    border-radius: 22px;
    padding: 20px 20px 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    overflow: hidden;
    border: 1px solid #f0f0f0;
}
.top-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
    border-color: rgba(0,0,0,0.05);
}

.top-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
.top-card-icon {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
}
.top-card:hover .top-card-icon {
    transform: scale(1.05);
}
.top-card-stats {
    text-align: right;
}
.top-card-label {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
    display: block;
    margin-bottom: 4px;
}
.top-card-value {
    font-size: 28px;
    font-weight: 800;
    color: #111827;
    line-height: 1;
}
.top-card-chart {
    margin-top: 8px;
    border-radius: 12px;
}
.top-card-skeleton .mantine-Skeleton-root {
    background: #eef2ff;
}
.bg-violet-50 .mantine-ThemeIcon-root { background: #ede9fe; color: #6d28d9; }
.bg-orange-50 .mantine-ThemeIcon-root { background: #fff7ed; color: #c2410c; }
.bg-green-50 .mantine-ThemeIcon-root { background: #f0fdf4; color: #16a34a; }
`;

export default TopCards;