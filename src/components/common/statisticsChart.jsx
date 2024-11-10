import React from 'react';
import Chart from 'react-apexcharts';

const StatisticsChart = ({ earningData }) => {

    const formattedData = earningData?.map(item => ({
        x: item?.x,
        y: parseFloat(item?.price) || 0,
    }));

    const options = {
        chart: {
            width: '100vw',
            type: 'line',
            stacked: false
        },
        dataLabels: {
            enabled: false,
            style: {
                fontSize: '16px',
            }
        },
        stroke: {
            curve: 'straight',
            width: 2,
        },
        markers: {
            size: 4,
            strokeColors: '#b4b4b4',
            backgroundColor: '#b4b4b4',
            shape: "circle",
            color: '#b4b4b4',
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            hover: {
                size: 5,
                sizeOffset: 3
            }
        },
        colors: ['#b4b4b4'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                gradientToColors: ['linear-gradient(180deg, rgba(170, 133, 85, 0.15) 50%, rgba(39, 49, 66, 0.0293652) 88.92%'],
                opacityFrom: 0.7,
                opacityTo: 0.5,
                stops: [0, 100]
            },
            inverseColors: false,
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#000',
                },
            },
        },
        yaxis: {
            tickAmount: 5,
            labels: {
                style: {
                    colors: '#000',
                },
                formatter: function (val) {
                    return val;
                }
            }
        },
        responsive: [{
            breakpoint: 500,
            options: {
                chart: {
                    height: 250
                },
                legend: {
                    show: false
                }
            }
        }],
        legend: {
            show: false,
        },
    }

    const seriesArea = [{ data: formattedData }];

    return (
        <div className='rounded-4 w-full shadow-sm mt-5 p-4' style={{ backgroundColor: '#FFF6F6' }}>
            <h6 className="text_dark plusJakara_semibold">
                Earinings
            </h6>
            <div style={{ height: '350px' }}>
                <Chart options={options} series={seriesArea} type="area" height={350} />
            </div>
        </div>
    )
}

export default StatisticsChart;
