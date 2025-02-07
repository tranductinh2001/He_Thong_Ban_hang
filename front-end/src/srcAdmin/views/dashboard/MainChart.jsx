import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";
import * as XLSX from "xlsx";
import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";

import {
  cilCloudDownload,
} from "@coreui/icons";

const MainChart = () => {
  const chartRef = useRef(null);
  const statisticsByYear = useSelector(
    (state) => state.statistic?.statisticsByYear
  );
  const statisticsByDateRange = useSelector(
    (state) => state.statistic?.statisticsByDateRange
  );
  const statisticsByMonth = useSelector(
    (state) => state.statistic?.statisticsByMonth
  );

  const years = Array.isArray(statisticsByYear)
    ? statisticsByYear.map((item) => item[0])
    : [];
  const yearValues = Array.isArray(statisticsByYear)
    ? statisticsByYear.map((item) => item[1])
    : [];

  const labelsByDateRange = Array.isArray(statisticsByDateRange)
    ? statisticsByDateRange.map((item) => item[0])
    : [];
  const dateRangeValues = Array.isArray(statisticsByDateRange)
    ? statisticsByDateRange.map((item) => item[1])
    : [];

  const labelsByMonth = Array.isArray(statisticsByMonth)
    ? statisticsByMonth.map((item) => item[0])
    : [];
  const monthValues = Array.isArray(statisticsByMonth)
    ? statisticsByMonth.map((item) => item[1])
    : [];

  useEffect(() => {
    if (chartRef.current) {
      setTimeout(() => {
        chartRef.current.update();
      });
    }
  }, [statisticsByYear, statisticsByDateRange, statisticsByMonth]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const data = [
      ["Thời gian", "Dữ liệu (VND)"], 
      ...(
        labelsByMonth.length > 0
          ? labelsByMonth.map((label, index) => [
              label,
              monthValues[index],
            ])
          : labelsByDateRange.length > 0
          ? labelsByDateRange.map((label, index) => [
              label,
              dateRangeValues[index],
            ])
          : years.length > 0
          ? years.map((label, index) => [
              label,
              yearValues[index],
            ])
          : []
      ),
    ];
  
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Dữ liệu thống kê");
    XLSX.writeFile(wb, "thong_ke.xlsx");
  };
  

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: "300px", marginTop: "40px" }}
        data={{
          labels:
            labelsByMonth.length > 0
              ? labelsByMonth
              : labelsByDateRange.length > 0
              ? labelsByDateRange
              : years,
          datasets: [
            {
              label: "Dữ liệu theo tháng",
              backgroundColor: `rgba(${getStyle("--cui-warning-rgb")}, .1)`,
              borderColor: getStyle("--cui-warning"),
              pointHoverBackgroundColor: getStyle("--cui-warning"),
              borderWidth: 2,
              data: monthValues,
              fill: true,
            },
            {
              label: "Dữ liệu theo khoảng ngày",
              backgroundColor: `rgba(${getStyle("--cui-info-rgb")}, .1)`,
              borderColor: getStyle("--cui-info"),
              pointHoverBackgroundColor: getStyle("--cui-info"),
              borderWidth: 2,
              data: dateRangeValues,
            },
            {
              label: "Dữ liệu theo năm",
              backgroundColor: "transparent",
              borderColor: getStyle("--cui-success"),
              pointHoverBackgroundColor: getStyle("--cui-success"),
              borderWidth: 2,
              data: yearValues,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle("--cui-border-color-translucent"),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle("--cui-body-color"),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle("--cui-border-color-translucent"),
              },
              grid: {
                color: getStyle("--cui-border-color-translucent"),
              },
              max:
                Math.max(...yearValues, ...dateRangeValues, ...monthValues) +
                1000000,
              ticks: {
                color: getStyle("--cui-body-color"),
                maxTicksLimit: 5,
                stepSize: Math.ceil(
                  Math.max(...yearValues, ...dateRangeValues, ...monthValues) /
                    5
                ),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
      {/* <button onClick={exportToExcel} style={{ marginTop: "20px" }}>
        Xuất Excel
      </button> */}
      <CButton onClick={exportToExcel} color="primary" className="float-end">
        <CIcon icon={cilCloudDownload} />
      </CButton>
    </>
  );
};

export default MainChart;
