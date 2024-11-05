import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'react-apexcharts'; // Đảm bảo bạn cài đặt react-apexcharts
import moment from 'moment';

export default function DashboardPage() {
    const [username, setUsername] = useState(''); // Thay thế với logic username thực tế
    const [countDestination, setCountDestination] = useState(0);
    const [countTour, setCountTour] = useState(0);
    const [countUser, setCountUser] = useState(0);
    const [countUserOnline, setCountUserOnline] = useState(0);
    const [countReviews, setCountReviews] = useState(0);
    const [countTicket, setCountTicket] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);

    const [showMonth, setShowMonth] = useState(false);
    const [showYear, setShowYear] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const toggleMonthInput = () => setShowMonth(!showMonth);
    const toggleYearInput = () => setShowYear(!showYear);

    const getStatisticByMonth = () => {
        // Implement the logic to get statistics by month
    };

    const getStatisticByYear = () => {
        // Implement the logic to get statistics by year
    };

    return (
        <>
            <div className="page-wrapper">
                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-brand">
                        <Link to="/dashboard" className="logo">
                            <img src="assets/img/about.jpg" alt="User Avatar" className="user-avatar" />
                        </Link>
                        <Link to="/dashboard" className="logo-sm">
                            <img src="assets/img/about.jpg" alt="User Avatar" className="user-avatar" />
                        </Link>
                    </div>
                    <div className="sidebar-content">
                        <div className="sidebar-menu">
                            <ul>
                                <li className="header-menu">Tổng quan</li>
                                <li>
                                    <Link to="/dashboard">
                                        <i className="icon-devices_other"></i>
                                        <span className="menu-text">Dashboards</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/qltour">
                                        <i className="fa-brands fa-servicestack"></i>
                                        <span className="menu-text">Quản lý tour</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/qlservice">
                                        <i className="fa-solid fa-tty"></i>
                                        <span className="menu-text">Quản lý dịch vụ</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/qldestination">
                                        <i className="icon-location"></i>
                                        <span className="menu-text">Quản lý địa điểm</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/qlreview">
                                        <i className="icon-rate_review"></i>
                                        <span className="menu-text">Quản lý đánh giá</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/qlticket">
                                        <i className="fa-regular fa-square-check"></i>
                                        <span className="menu-text">Quản lý ticket</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/qluser">
                                        <i className="icon-user1"></i>
                                        <span className="menu-text">Quản lý người dùng</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="page-content">
                    <header className="header">
                        <div className="toggle-btns">
                            <Link id="toggle-sidebar" to="/dashboard">
                                <i className="icon-list"></i>
                            </Link>
                        </div>
                        <div className="header-items">
                            <div className="custom-search">
                                <input type="text" className="search-query" placeholder="tìm kiếm ..." />
                                <i className="icon-search1"></i>
                            </div>
                            <ul className="header-actions">
                                <li className="dropdown">
                                    <Link to="/dashboard" id="userSettings" className="user-settings" data-toggle="dropdown" aria-haspopup="true">
                                        <span className="user-name">{username}</span>
                                        <img src="assets/img/about.jpg" alt="User Avatar" className="avatar" />
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userSettings">
                                        <div className="header-profile-actions">
                                            <div className="header-user-profile">
                                                <div className="header-user">
                                                    <img src="assets/img/about.jpg" alt="User Avatar" className="user-avatar" />
                                                </div>
                                                <h5>{username}</h5>
                                                <p>{username}</p>
                                            </div>
                                            <Link to="/"><i className="icon-log-out1"></i>Quay lại index</Link>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </header>

                    <div className="page-header">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Dashboards</li>
                            <li className="breadcrumb-item active">Thống kê quản lý tour du lịch</li>
                        </ol>
                    </div>

                    <div className="main-container">
                        <div className="row gutters">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Thống kê quản lý tour du lịch</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row gutters">
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Tổng địa điểm du lịch</h6>
                                                    <h3>{countDestination}</h3>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Tổng tour du lịch</h6>
                                                    <h3>{countTour}</h3>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Tổng người dùng</h6>
                                                    <h3>{countUser}</h3>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Số lượng người đang truy cập</h6>
                                                    <h3>{countUserOnline}</h3>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Tổng đánh giá trải nghiệm</h6>
                                                    <h3>{countReviews}</h3>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Tổng vé còn đang được kích hoạt</h6>
                                                    <h3>{countTicket}</h3>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-sm-4 col-12">
                                                <div className="ticket-status-card">
                                                    <h6>Thống kê doanh thu</h6>
                                                    <h3>{sumPrice}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row gutters">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Biểu đồ mô tả</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="custom-btn-group" role="group">
                                            <button type="button" className="btn btn-outline-primary btn-sm btn-rounded">Hôm nay</button>
                                            <button type="button" className="btn btn-outline-secondary btn-sm btn-rounded" onClick={toggleMonthInput}>Theo tháng</button>
                                            <button type="button" className="btn btn-outline-secondary btn-sm btn-rounded" onClick={toggleYearInput}>Theo năm</button>
                                        </div>
                                        {showMonth && (
                                            <div>
                                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                                    {[...Array(12).keys()].map(i => (
                                                        <option key={i} value={i + 1}>{moment().month(i).format('MMMM')}</option>
                                                    ))}
                                                </select>
                                                <button onClick={getStatisticByMonth}>Xem thống kê theo tháng</button>
                                            </div>
                                        )}
                                        {showYear && (
                                            <div>
                                                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                                    {[...Array(5).keys()].map(i => (
                                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                                    ))}
                                                </select>
                                                <button onClick={getStatisticByYear}>Xem thống kê theo năm</button>
                                            </div>
                                        )}
                                        <Chart
                                            options={{
                                                chart: { id: "basic-bar" },
                                                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
                                            }}
                                            series={[
                                                {
                                                    name: "series-1",
                                                    data: [30, 40, 45, 50, 49, 60],
                                                },
                                            ]}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
