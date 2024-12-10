import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio, DatePicker } from "antd";

import { CCard, CCardBody, CCol, CRow } from "@coreui/react";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import MainChart from "./MainChart";

import {
  fetchStatisticAll,
  fetchStatisticsByYear,
  fetchStatisticsByDateRange,
  fetchStatisticsByMonth,
} from "../../../redux/slices/statisticSlice.js";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const dispatch = useDispatch();

  const statisticAll = useSelector((state) => state.statistic.statisticAll);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchStatisticAll());
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const [option, setOption] = useState("day");
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);

    if (dates && dates.length === 2) {
      let dateRangeString = "";
      if (option === "day") {
        const startDay = dates[0].format("YYYY-MM-DD");
        const endDay = dates[1].format("YYYY-MM-DD");
        dateRangeString = `${startDay} - ${endDay}`;
        dispatch(
          fetchStatisticsByDateRange({
            startDate: startDay,
            endDate: endDay,
          })
        );
        console.log("Lấy dữ liệu theo ngày:", startDay, endDay);
      } else if (option === "month") {
        const startMonth = dates[0].format("YYYY-MM");
        const endMonth = dates[1].format("YYYY-MM");
        dateRangeString = `${startMonth} - ${endMonth}`;
        dispatch(
          fetchStatisticsByMonth({
            startMonth: startMonth,
            endMonth: endMonth,
          })
        );
        console.log("Lấy dữ liệu theo tháng:", startMonth, endMonth);
      } else if (option === "year") {
        const startYear = dates[0].year();
        const endYear = dates[1].year();
        dateRangeString = `${startYear} - ${endYear}`;
        dispatch(
          fetchStatisticsByYear({
            startYear: startYear,
            endYear: endYear,
          })
        );
        console.log("Lấy dữ liệu theo năm:", startYear, endYear);
      }
      setSelectedDateRange(dateRangeString);
    }
  };

  // Sử dụng useEffect để gọi API mặc định khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu theo năm và theo khoảng thời gian mặc định
        dispatch(fetchStatisticsByYear({ startYear: 2011, endYear: 2025 }));
        dispatch(
          fetchStatisticsByDateRange({
            startDate: "2024-01-01",
            endDate: "2024-01-31",
          })
        );
      } catch (error) {
        console.error("Lỗi không lấy được thống kê:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      <WidgetsDropdown className="mb-4" statisticAll={statisticAll} />
      <div className="mb-10">
        <Radio.Group onChange={handleOptionChange} value={option}>
          <Radio.Button value="day">Theo ngày</Radio.Button>
          <Radio.Button value="month">Theo tháng</Radio.Button>
          <Radio.Button value="year">Theo năm</Radio.Button>
        </Radio.Group>

        <RangePicker
          picker={option}
          value={dateRange}
          onChange={handleDateChange}
          style={{ marginTop: 16 }}
          placeholder={
            option === "day"
              ? ["Chọn ngày bắt đầu", "Chọn ngày kết thúc"]
              : option === "month"
              ? ["Chọn tháng bắt đầu", "Chọn tháng kết thúc"]
              : ["Chọn năm bắt đầu", "Chọn năm kết thúc"]
          }
          disabledDate={(current) => {
            return current && current > dayjs().endOf("day");
          }}
        />
      </div>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="mb-0 card-title">
                Số liệu thống kê dạng bảng
              </h4>
              <div className="small text-body-secondary">
                {selectedDateRange || "January - July 2023"}
              </div>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
      </CCard>
      <WidgetsBrand className="mb-4" withCharts />
    </>
  );
};

export default Dashboard;
