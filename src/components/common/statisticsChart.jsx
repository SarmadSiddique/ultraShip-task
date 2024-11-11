import React from 'react';
import Chart from 'react-apexcharts';

const StatisticsChart = ({ graphdata }) => {
    const formattedData = graphdata?.map(item => ({
        x: item?.x,
        y: parseInt(item?.value) || 0, 
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
            curve: 'smooth',
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
        colors: ['#1E88E5'], 
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                gradientToColors: ['#81D4FA'], 
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
            title: {
                text: 'Time', 
                style: {
                    color: '#000'
                }
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
            },
            title: {
                text: 'Count', 
                style: {
                    color: '#000'
                }
            },
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
                Student Statistics
            </h6>
            <div style={{ height: '350px' }}>
                <Chart options={options} series={seriesArea} type="area" height={350} />
            </div>
        </div>
    )
}

export default StatisticsChart;
