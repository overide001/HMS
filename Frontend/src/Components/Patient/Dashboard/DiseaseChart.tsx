import { DonutChart } from "@mantine/charts";
import { Skeleton } from "@mantine/core";
import { diseaseData } from "../../../Data/DashboardData";
import { countReasonsByPatient } from "../../../Service/AppointmentService";
import { useEffect, useState } from "react";
import { convertReasonChartData } from "../../../Utility/OtherUtility";
import { useSelector } from "react-redux";

const DiseaseChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        if (!user?.profileId) return;
        setLoading(true);
        countReasonsByPatient(user.profileId)
            .then((res) => {
                const chartData = convertReasonChartData(res);
                setData(chartData);
            })
            .catch((err) => console.error("Error fetching patient reasons:", err))
            .finally(() => setLoading(false));
    }, [user.profileId]);

    // Calculate total for display
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Color palette (green theme)
    const chartColors = [
        "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec489a",
        "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#6366f1"
    ];

    // Assign colors to data
    const coloredData = data.map((item, idx) => ({
        ...item,
        color: item.color || chartColors[idx % chartColors.length]
    }));

    return (
        <>
            <style>{css}</style>
            <div className="disease-chart-wrapper">
                <div className="disease-chart-header">
                    <div className="disease-chart-header-left">
                        <span className="disease-chart-eyebrow">Your Insights</span>
                        <h2 className="disease-chart-title">Reason Distribution</h2>
                    </div>
                    {!loading && data.length > 0 && (
                        <div className="disease-chart-count-pill">
                            <span className="disease-chart-count-num">{total}</span>
                            <span className="disease-chart-count-lbl">total</span>
                        </div>
                    )}
                </div>

                <div className="disease-chart-rule" />

                <div className="disease-chart-content">
                    {loading ? (
                        <div className="disease-chart-loading">
                            <Skeleton height={200} circle width={200} mx="auto" mb="lg" />
                            <div className="disease-chart-legend-skeleton">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} height={16} width={100} radius="xl" />
                                ))}
                            </div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="disease-chart-empty">
                            <div className="disease-chart-empty-ring" />
                            <p className="disease-chart-empty-title">No data available</p>
                            <p className="disease-chart-empty-sub">You haven't had any appointments yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="disease-chart-container">
                                <DonutChart
                                    data={coloredData}
                                    size={200}
                                    thickness={25}
                                    paddingAngle={5}
                                    withLabels
                                    labelsType="percent"
                                    withTooltip
                                    tooltipDataSource="segment"
                                    chartLabel="Reasons"
                                    className="disease-chart"
                                />
                            </div>
                            <div className="disease-chart-legend">
                                {coloredData.map((item) => (
                                    <div key={item.name} className="disease-chart-legend-item">
                                        <div
                                            className="disease-chart-legend-color"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="disease-chart-legend-name">{item.name}</span>
                                        <span className="disease-chart-legend-value">({item.value})</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.disease-chart-wrapper {
    font-family: 'Outfit', sans-serif;
    background: #ffffff;
    border-radius: 22px;
    padding: 24px 22px 18px;
    border: 1px solid #d1fae5;
    box-shadow: 0 2px 8px rgba(16,185,129,0.06), 0 12px 40px rgba(16,185,129,0.08);
    position: relative;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.disease-chart-wrapper:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 28px rgba(16,185,129,0.18), 0 2px 8px rgba(0,0,0,0.05);
}
.disease-chart-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 80% 0%, rgba(16,185,129,0.05) 0%, transparent 70%);
    pointer-events: none;
}

.disease-chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 18px;
}
.disease-chart-header-left { display: flex; flex-direction: column; gap: 3px; }
.disease-chart-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #10b981;
}
.disease-chart-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.04em;
    line-height: 1;
}
.disease-chart-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(140deg, #10b981, #34d399);
    border-radius: 14px;
    padding: 7px 16px 6px;
    box-shadow: 0 4px 16px rgba(16,185,129,0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.disease-chart-count-pill:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 24px rgba(16,185,129,0.4);
}
.disease-chart-count-num { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.disease-chart-count-lbl { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

.disease-chart-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(16,185,129,0.15), transparent);
    margin-bottom: 16px;
}

.disease-chart-content {
    padding: 8px 0;
}

.disease-chart-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
.disease-chart {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.disease-chart:hover {
    transform: scale(1.02);
}

.disease-chart-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 20px;
    margin-top: 12px;
}
.disease-chart-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
}
.disease-chart-legend-color {
    width: 12px;
    height: 12px;
    border-radius: 4px;
}
.disease-chart-legend-name {
    color: #6b7280;
}
.disease-chart-legend-value {
    color: #9ca3af;
    font-weight: 400;
}

/* Loading */
.disease-chart-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
}
.disease-chart-legend-skeleton {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 20px;
    margin-top: 24px;
}

/* Empty */
.disease-chart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 52px 24px;
    gap: 8px;
}
.disease-chart-empty-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #a7f3d0;
    margin-bottom: 8px;
    animation: spin 8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.disease-chart-empty-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #64748b;
}
.disease-chart-empty-sub {
    margin: 0;
    font-size: 12.5px;
    color: #94a3b8;
}
`;

export default DiseaseChart;