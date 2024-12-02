import dayjs from 'dayjs';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio, DatePicker } from 'antd';
import { fetchUserList } from "../../../redux/slices/userSlice.js";
import { fetchProductListAll } from "../../../redux/slices/productSlice.js";
import { fetchOrders } from "../../../redux/slices/orderSlice.js";

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from "@coreui/icons";

import avatar1 from "../../../srcAdmin/assets/images/avatars/1.jpg";
import avatar2 from "../../../srcAdmin/assets/images/avatars/2.jpg";
import avatar3 from "../../../srcAdmin/assets/images/avatars/3.jpg";
import avatar4 from "../../../srcAdmin/assets/images/avatars/4.jpg";
import avatar5 from "../../../srcAdmin/assets/images/avatars/5.jpg";
import avatar6 from "../../../srcAdmin/assets/images/avatars/6.jpg";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import MainChart from "./MainChart";
import { fetchStatisticsByYear, fetchStatisticsByDateRange, fetchStatisticsByMonth } from '../../../redux/slices/statisticSlice.js';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.productListAll);
  const orders = useSelector((state) => state.order.orders);
  const users = useSelector((state) => state.user.userList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProductListAll());
        await dispatch(fetchUserList());
        await dispatch(fetchOrders());
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const progressExample = [
    { title: "Visits", value: "29.703 Users", percent: 40, color: "success" },
    { title: "Unique", value: "24.093 Users", percent: 20, color: "info" },
    {
      title: "Pageviews",
      value: "78.706 Views",
      percent: 60,
      color: "warning",
    },
    { title: "New Users", value: "22.123 Users", percent: 80, color: "danger" },
    {
      title: "Bounce Rate",
      value: "Average Rate",
      percent: 40.15,
      color: "primary",
    },
  ];

  const progressGroupExample1 = [
    { title: "Monday", value1: 34, value2: 78 },
    { title: "Tuesday", value1: 56, value2: 94 },
    { title: "Wednesday", value1: 12, value2: 67 },
    { title: "Thursday", value1: 43, value2: 91 },
    { title: "Friday", value1: 22, value2: 73 },
    { title: "Saturday", value1: 53, value2: 82 },
    { title: "Sunday", value1: 9, value2: 69 },
  ];

  const progressGroupExample2 = [
    { title: "Male", icon: cilUser, value: 53 },
    { title: "Female", icon: cilUserFemale, value: 43 },
  ];

  const progressGroupExample3 = [
    { title: "Organic Search", icon: cibGoogle, percent: 56, value: "191,235" },
    { title: "Facebook", icon: cibFacebook, percent: 15, value: "51,223" },
    { title: "Twitter", icon: cibTwitter, percent: 11, value: "37,564" },
    { title: "LinkedIn", icon: cibLinkedin, percent: 8, value: "27,319" },
  ];

  const tableExample = [
    {
      avatar: { src: avatar1, status: "success" },
      user: {
        name: "Yiorgos Avraamu",
        new: true,
        registered: "Jan 1, 2023",
      },
      country: { name: "USA", flag: cifUs },
      usage: {
        value: 50,
        period: "Jun 11, 2023 - Jul 10, 2023",
        color: "success",
      },
      payment: { name: "Mastercard", icon: cibCcMastercard },
      activity: "10 sec ago",
    },
    {
      avatar: { src: avatar2, status: "danger" },
      user: {
        name: "Avram Tarasios",
        new: false,
        registered: "Jan 1, 2023",
      },
      country: { name: "Brazil", flag: cifBr },
      usage: {
        value: 22,
        period: "Jun 11, 2023 - Jul 10, 2023",
        color: "info",
      },
      payment: { name: "Visa", icon: cibCcVisa },
      activity: "5 minutes ago",
    },
    {
      avatar: { src: avatar3, status: "warning" },
      user: { name: "Quintin Ed", new: true, registered: "Jan 1, 2023" },
      country: { name: "India", flag: cifIn },
      usage: {
        value: 74,
        period: "Jun 11, 2023 - Jul 10, 2023",
        color: "warning",
      },
      payment: { name: "Stripe", icon: cibCcStripe },
      activity: "1 hour ago",
    },
    {
      avatar: { src: avatar4, status: "secondary" },
      user: { name: "Enéas Kwadwo", new: true, registered: "Jan 1, 2023" },
      country: { name: "France", flag: cifFr },
      usage: {
        value: 98,
        period: "Jun 11, 2023 - Jul 10, 2023",
        color: "danger",
      },
      payment: { name: "PayPal", icon: cibCcPaypal },
      activity: "Last month",
    },
    {
      avatar: { src: avatar5, status: "success" },
      user: {
        name: "Agapetus Tadeáš",
        new: true,
        registered: "Jan 1, 2023",
      },
      country: { name: "Spain", flag: cifEs },
      usage: {
        value: 22,
        period: "Jun 11, 2023 - Jul 10, 2023",
        color: "primary",
      },
      payment: { name: "Google Wallet", icon: cibCcApplePay },
      activity: "Last week",
    },
    {
      avatar: { src: avatar6, status: "danger" },
      user: {
        name: "Friderik Dávid",
        new: true,
        registered: "Jan 1, 2023",
      },
      country: { name: "Poland", flag: cifPl },
      usage: {
        value: 43,
        period: "Jun 11, 2023 - Jul 10, 2023",
        color: "success",
      },
      payment: { name: "Amex", icon: cibCcAmex },
      activity: "Last week",
    },
  ];

  const [option, setOption] = useState('day'); // Giá trị mặc định là 'day'
  const [dateRange, setDateRange] = useState([null, null]); // Khoảng ngày được chọn

  const handleOptionChange = (e) => {
    setOption(e.target.value); // Thay đổi option (day, month, year)
  };

  const handleDateChange = (dates) => {
    setDateRange(dates); // Lưu giá trị ngày/tháng/năm đã chọn

    if (dates && dates.length === 2) {
      if (option === 'day') {
        const startDay = dates[0].format('YYYY-MM-DD');
        const endDay = dates[1].format('YYYY-MM-DD');
        // Gọi API để lấy dữ liệu theo ngày
        dispatch(fetchStatisticsByDateRange({
          startDate: startDay,
          endDate: endDay,
        }));
        console.log('Lấy dữ liệu theo ngày:', startDay, endDay);
      } else if (option === 'month') {
        const startMonth = dates[0].format('YYYY-MM');
        const endMonth = dates[1].format('YYYY-MM');
        // Gọi API để lấy dữ liệu theo tháng
        dispatch(fetchStatisticsByMonth({
          startMonth: startMonth,
          endMonth: endMonth,
        }));
        console.log('Lấy dữ liệu theo tháng:', startMonth, endMonth);
      } else if (option === 'year') {
        const startYear = dates[0].year();
        const endYear = dates[1].year();
        // Gọi API để lấy dữ liệu theo năm
        dispatch(fetchStatisticsByYear({
          startYear: startYear,
          endYear: endYear,
        }));
        console.log('Lấy dữ liệu theo năm:', startYear, endYear);
      }
    }
  };

  // Sử dụng useEffect để gọi API mặc định khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu theo năm và theo khoảng thời gian mặc định
        dispatch(fetchStatisticsByYear({ startYear: 2011, endYear: 2025 }));
        dispatch(fetchStatisticsByDateRange({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        }));
      } catch (error) {
        console.error("Lỗi không lấy được thống kê:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      <div className="mb-10">
        <Radio.Group onChange={handleOptionChange} value={option}>
          <Radio.Button value="day">Theo ngày</Radio.Button>
          <Radio.Button value="month">Theo tháng</Radio.Button>
          <Radio.Button value="year">Theo năm</Radio.Button>
        </Radio.Group>

        <RangePicker
          picker={option} // "month" cho chọn tháng, "year" cho chọn năm
          value={dateRange}
          onChange={handleDateChange} // Gọi handleDateChange khi thay đổi ngày
          style={{ marginTop: 16 }}
          placeholder={
            option === 'day'
              ? ['Chọn ngày bắt đầu', 'Chọn ngày kết thúc']
              : option === 'month'
              ? ['Chọn tháng bắt đầu', 'Chọn tháng kết thúc']
              : ['Chọn năm bắt đầu', 'Chọn năm kết thúc']
          }
          disabledDate={(current) => {
            return current && current > dayjs().endOf('day'); // Không cho phép chọn ngày trong tương lai
          }}
        />
      </div>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="mb-0 card-title">
                Traffic
              </h4>
              <div className="small text-body-secondary">
                January - July 2023
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {["Day", "Month", "Year"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === "Month"}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  "d-none d-xl-block": index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress
                  thin
                  className="mt-2"
                  color={item.color}
                  value={item.percent}
                />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
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
      </CRow>
    </>
  );
};

export default Dashboard;
