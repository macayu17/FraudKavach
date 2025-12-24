import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const SpendBarChart = ({ data }) => {
    const { isDark } = useTheme();
    const textColor = isDark ? '#9ca3af' : '#6b7280';
    const gridColor = isDark ? '#374151' : '#f3f4f6';

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: gridColor,
                },
                ticks: {
                    color: textColor,
                    callback: (value) => '₹' + value
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: textColor
                }
            }
        }
    };

    const chartData = {
        labels: data.map(d => d.date), // Expecting 'YYYY-MM-DD'
        datasets: [
            {
                label: 'Spending',
                data: data.map(d => d.amount),
                backgroundColor: '#1A1F71', // Visa Blue always
                borderRadius: 6,
            },
        ],
    };

    return <Bar options={options} data={chartData} />;
};

export const CategoryDoughnutChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.category),
        datasets: [
            {
                label: 'Spend by Category',
                data: data.map(d => d.total),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return <Doughnut data={chartData} />;
};
