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
       //console.log("Lấy dữ liệu theo ngày:", startDay, endDay);
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
       //console.log("Lấy dữ liệu theo tháng:", startMonth, endMonth);
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
       //console.log("Lấy dữ liệu theo năm:", startYear, endYear);
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
      {/* <WidgetsDropdown className="mb-4" /> */}
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
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      {/* <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {" & "} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="px-3 py-1 border-start border-start-4 border-start-info">
                        <div className="text-body-secondary text-truncate small">
                          New Clients
                        </div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="px-3 py-1 mb-3 border-start border-start-4 border-start-danger">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="mb-4 progress-group" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">
                          {item.title}
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="px-3 py-1 mb-3 border-start border-start-4 border-start-warning">
                        <div className="text-body-secondary text-truncate small">
                          Pageviews
                        </div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="px-3 py-1 mb-3 border-start border-start-4 border-start-success">
                        <div className="text-body-secondary text-truncate small">
                          Organic
                        </div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="mb-4 progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}%
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{" "}
                          <span className="text-body-secondary small">
                            ({item.percent}%)
                          </span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="text-center bg-body-tertiary">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      User
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center bg-body-tertiary">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      Usage
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center bg-body-tertiary">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      Activity
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          src={item.avatar.src}
                          status={item.avatar.status}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? "New" : "Recurring"}</span> |
                          Registered: {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon
                          size="xl"
                          icon={item.country.flag}
                          title={item.country.name}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">
                              {item.usage.period}
                            </small>
                          </div>
                        </div>
                        <CProgress
                          thin
                          color={item.usage.color}
                          value={item.usage.value}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">
                          Last login
                        </div>
                        <div className="fw-semibold text-nowrap">
                          {item.activity}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
      <WidgetsBrand className="mb-4" withCharts />
    </>
  );
};

export default Dashboard;
