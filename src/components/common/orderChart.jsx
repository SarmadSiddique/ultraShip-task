/* eslint-disable array-bracket-newline */
/* eslint-disable quote-props */
/* eslint-disable prefer-template */
/* eslint-disable semi */
/* eslint-disable object-shorthand */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
import React from 'react';
import Chart from 'react-apexcharts';

const OrderChart = () => {
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
        colors: ['#eb2222', '#008FFB', '#08E395', "#FFAF1C"],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                gradientToColors: ['linear-gradient(180deg, #eb2222 50%, rgba(39, 49, 66, 0.0293652) 88.92%)', '#008FFB', '#08E395', "#FFAF1C"],
                opacityFrom: 0.7,
                opacityTo: 0.5,
                stops: [0, 100]
            },
            inverseColors: false,
            shadow: {
                enabled: false,
                color: ['#eb2222', '#008FFB', "#08E395", "#FFAF1C"],
                opacity: 1,
                offsetX: 0,
                offsetY: 0
            },
            padding: {
                top: 10,
                bottom: 10
            },
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

    const data1 = [
        { "x": "Jan", "y": 60000 },
        { "x": "Feb", "y": 20000 },
        { "x": "Mar", "y": 70000 },
        { "x": "Apr", "y": 30000 },
        { "x": "May", "y": 56000 },
        { "x": "Jun", "y": 39000 },
        { "x": "Jul", "y": 90000 },
        { "x": "Aug", "y": 48000 },
        { "x": "Sep", "y": 67000 },
        { "x": "Oct", "y": 46000 },
        { "x": "Nov", "y": 40000 },
        { "x": "Dec", "y": 0 },
        { "x": "Vex", "y": 0 },
        { "x": "Dea", "y": 56000 },
        { "x": "Dew", "y": 96000 },
    ]

    const data2 = [
        { "x": "Jan", "y": 1000 },
        { "x": "Feb", "y": 15000 },
        { "x": "Mar", "y": 20000 },
        { "x": "Apr", "y": 0 },
        { "x": "May", "y": 1000 },
        { "x": "Jun", "y": 0 },
        { "x": "Jul", "y": 0 },
        { "x": "Aug", "y": 45000 },
        { "x": "Sep", "y": 30000 },
        { "x": "Oct", "y": 0 },
        { "x": "Nov", "y": 35000 },
        { "x": "Dec", "y": 100 },
        { "x": "Vex", "y": 10000 },
        { "x": "Dea", "y": 2000 },
        { "x": "Dew", "y": 0 },
    ]
    const data3 = [
        { "x": "Jan", "y": 0 },
        { "x": "Feb", "y": 0 },
        { "x": "Mar", "y": 0 },
        { "x": "Apr", "y": 0 },
        { "x": "May", "y": 1000 },
        { "x": "Jun", "y": 0 },
        { "x": "Jul", "y": 0 },
        { "x": "Aug", "y": 5000 },
        { "x": "Sep", "y": 10000 },
        { "x": "Oct", "y": 0 },
        { "x": "Nov", "y": 0 },
        { "x": "Dec", "y": 100 },
        { "x": "Vex", "y": 20000 },
        { "x": "Dea", "y": 10000 },
        { "x": "Dew", "y": 0 },
    ]
    const data4 = [
        { "x": "Jan", "y": 0 },
        { "x": "Feb", "y": 0 },
        { "x": "Mar", "y": 0 },
        { "x": "Apr", "y": 0 },
        { "x": "May", "y": 0 },
        { "x": "Jun", "y": 0 },
        { "x": "Jul", "y": 0 },
        { "x": "Aug", "y": 0 },
        { "x": "Sep", "y": 0 },
        { "x": "Oct", "y": 0 },
        { "x": "Nov", "y": 0 },
        { "x": "Dec", "y": 0 },
        { "x": "Vex", "y": 0 },
        { "x": "Dea", "y": 0 },
        { "x": "Dew", "y": 0 },
    ]

    const seriesArea = [
        { name: 'Cancelled Order', data: data1 },
        { name: 'Confirm Order', data: data2 },
        { name: 'Completed Order', data: data3 },
        { name: 'Pending Order', data: data4 },
    ]

    return (
        <div className='bg_white rounded-2 w-full shadow-sm p-3'>
            <h6 className="text_dark plusJakara_semibold">
                Service Order History
            </h6>
            <div style={{ height: '350px' }}>
                <Chart options={options} series={seriesArea} type="area" height={350} />
            </div>
        </div>
    )
}

export default OrderChart;
