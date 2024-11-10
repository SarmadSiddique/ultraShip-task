/* eslint-disable prefer-template */
/* eslint-disable semi */
/* eslint-disable no-confusing-arrow */
/* eslint-disable multiline-ternary */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import ChartjsLineChart from '../common/ChartjsLineChart';

const Reports = () => {
    const [loading, setLoading] = useState(false)
    const [lastId, setLastId] = useState(1);
    const [lastId2, setLastId2] = useState(0);
    const [count, setcount] = useState(0);
    const [categories, setCategories] = useState([0, 1, 2, 3])
    const labelColor = '#6e6b7b';
    const gridLineColor = 'rgba(200, 200, 200, 0.2)';

    const columns = [
        {
            name: 'Name',
            sortable: true,
            selector: (row) => !row?.user?.fname && !row?.user?.lname ? 'User Not found' : row?.user?.fname + ' ' + row?.user?.lname
        },

        {
            name: "Order ID",
            sortable: true,
            selector: (row) => row?.user?.phone || 'Not found'
        },
        {
            name: "Date",
            sortable: true,
            selector: (row) => row?.service?.title || 'Not found'
        },
        {
            name: "Total",
            sortable: true,
            selector: (row) => row?.service?.price ? '$' + row?.service?.price : '$0'
        }
    ]
    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="lg:container p-4 mx-auto" style={{ minHeight: '90vh' }}>
                <div className="d-flex flex-column mb-2 w-100 w-full">
                    <h4 className={"headTitle"}>All Reports</h4>
                </div>
                <ChartjsLineChart
                    labelColor={labelColor}
                    gridLineColor={gridLineColor}
                    lineChartDanger='#003F7D'
                    lineChartPrimary='#FF8E00'
                    warningColorShade='#003F7D'
                />
            </main>
        </StyleSheetManager>
    )
}

export default Reports;