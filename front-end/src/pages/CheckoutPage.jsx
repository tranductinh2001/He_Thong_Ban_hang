import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../redux/slices/cartSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart?.products);
  const totalCart = useSelector((state) => state.cart?.total);
  const { code } = useParams(); // Lấy `code` từ URL params
  const totalItems = cartData.reduce((total, item) => total + item.count, 0);

  console.log("cartData   ", cartData);
  console.log("totalCart   ", totalCart);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  const getQrCodeUrl = () => {
    const phone = "0365854631";
    const amount = totalCart; // Lấy tổng tiền từ CartService
    const note = code;
    return `https://momosv3.apimienphi.com/api/QRCode?phone=${phone}&amount=${amount}&note=${note}`;
  };
  // console.log("getQrCodeUrl:", getQrCodeUrl());

  //config tiền tổng giỏ hảng các item
  const calculatedTotal = cartData.reduce((total, item) => {
    const price = item.product.sale
      ? item.product.salePrice
      : item.product.price;
    return total + price * item.count;
  }, 0);

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol size="12">
            <MDBCard
              className="card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow className="g-0">
                  <MDBCol lg="8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <MDBTypography
                          tag="h1"
                          className="fw-bold mb-0 text-black"
                        >
                          Thanh toán
                        </MDBTypography>
                        <MDBTypography className="mb-0 text-muted">
                        {totalItems} sản phẩm
                        </MDBTypography>
                      </div>

                      <hr className="my-4" />

                      {cartData.map((item, index) => (
                        <MDBRow
                          key={index}
                          className="mb-4 d-flex justify-content-between align-items-center"
                        >
                          <MDBCol md="2" lg="2" xl="2">
                            <MDBCardImage
                              src={
                                item.product.images[0] ||
                                "https://via.placeholder.com/150"
                              }
                              fluid
                              className="rounded-3"
                              alt={item.product.name}
                            />
                          </MDBCol>
                          <MDBCol md="3" lg="3" xl="3">
                            <MDBTypography tag="h6" className="text-black mb-0">
                              {item.product.name}
                            </MDBTypography>
                            <MDBTypography tag="small" className="text-muted">
                              Size: {item.size}
                            </MDBTypography>
                          </MDBCol>
                          <MDBCol
                            md="3"
                            lg="3"
                            xl="3"
                            className="d-flex align-items-center"
                          >
                            <MDBBtn color="link" className="px-2">
                              <MDBIcon fas icon="minus" />
                            </MDBBtn>

                            <MDBInput
                              type="number"
                              min="1"
                              value={item.count}
                              size="sm"
                              readOnly
                            />

                            <MDBBtn color="link" className="px-2">
                              <MDBIcon fas icon="plus" />
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="3" lg="2" xl="2" className="text-end">
                            <MDBTypography tag="h6" className="mb-0">
                              {item.product.sale
                                ? item.product.salePrice.toLocaleString(
                                    "vi-VN"
                                  ) + "₫"
                                : item.product.price.toLocaleString("vi-VN") +
                                  "₫"}
                            </MDBTypography>
                          </MDBCol>
                          <MDBCol md="1" lg="1" xl="1" className="text-end">
                            <MDBBtn color="link" className="text-danger">
                              <MDBIcon fas icon="trash" />
                            </MDBBtn>
                          </MDBCol>
                          <hr className="my-4" />

                        </MDBRow>
                      ))}

<MDBCard className="mb-4">
  <MDBCardBody>
    <MDBTypography tag="h5" className="fw-bold mb-3">
      Hướng dẫn chuyển tiền
    </MDBTypography>
    <MDBTypography tag="p" className="mb-3">
  <strong className="text-primary">Số tài khoản:</strong> 
  <span className="fw-bold text-dark">123456789</span>
</MDBTypography>
<MDBTypography tag="p" className="mb-3">
  <strong className="text-primary">Ngân hàng:</strong> 
  <span className="fw-bold text-dark">Vietcombank - Chi nhánh Hà Nội</span>
</MDBTypography>
<MDBTypography tag="p" className="mb-3">
  <strong className="text-primary">Chủ tài khoản:</strong> 
  <span className="fw-bold text-dark">Nguyễn Văn A</span>
</MDBTypography>
<MDBTypography tag="p" className="mb-3">
  <strong className="text-primary">Nội dung chuyển khoản:</strong> 
  <span className="fw-bold text-danger">{code} (Mã đơn hàng)</span>
</MDBTypography>
<MDBTypography tag="p" className="text-muted">
  <span className="text-danger fw-bold">!Vui lòng sử dụng chính xác nội dung chuyển khoản </span> 
   để hệ thống ghi nhận thanh toán.
</MDBTypography>

    <MDBTypography tag="h5" className="fw-bold mt-4 mb-3">
      Hoặc quét mã QR
    </MDBTypography>
    <MDBCardImage
      src={getQrCodeUrl()} // Hàm trả về URL QR code
      alt="QR Code"
      className="rounded mx-auto d-block"
      style={{ width: "200px", height: "200px" }}
    />
    <MDBTypography tag="p" className="text-muted text-center mt-3">
      Sử dụng ứng dụng ngân hàng MOMO để quét mã QR và thanh toán.
    </MDBTypography>
  </MDBCardBody>
</MDBCard>


                      <div className="pt-5">
                        <MDBTypography tag="h6" className="mb-0">
                          <MDBCardText tag="a" href="/" className="text-body">
                            <MDBIcon fas icon="long-arrow-alt-left me-2" /> Quay
                            lại trang chủ
                          </MDBCardText>
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol lg="4" className="bg-grey">
                    <div className="p-5">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-5 mt-2 pt-1"
                      >
                        Tài khoản nhận
                      </MDBTypography>

                      <h1>Thanh Toán bằng mã QR</h1>
                      <div>
                        <img src={getQrCodeUrl()} alt="QR Code" />
                      </div>
                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-4">
                        <MDBTypography tag="h5" className="text-uppercase">
                          tổng có {totalItems} sản phẩm
                        </MDBTypography>
                        <MDBTypography tag="h5">
                          Tổng cộng: {calculatedTotal.toLocaleString("vi-VN")}₫
                        </MDBTypography>
                      </div>

                      {/* <MDBTypography tag="h5" className="text-uppercase mb-3">
                        Shipping
                      </MDBTypography>

                      <div className="mb-4 pb-2">
                        <select
                          className="select p-2 rounded bg-grey"
                          style={{ width: "100%" }}
                        >
                          <option value="1">Standard-Delivery- €5.00</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                          <option value="4">Four</option>
                        </select>
                      </div> */}

                      <MDBTypography tag="h5" className="text-uppercase mb-3">
                        Mã giảm giá
                      </MDBTypography>

                      <div className="mb-5">
                        <MDBInput size="lg" label="Nhập mã giảm giá của bạn" />
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-5">
                        <MDBTypography tag="h5" className="text-uppercase">
                          Tổng giá phải trả
                        </MDBTypography>
                        <MDBTypography tag="h5">{calculatedTotal.toLocaleString("vi-VN")}₫</MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
