import LayoutClient from "./layout/LayoutClient";
import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { fetchUserDetail } from "./redux/slices/authSlice";
import { fetchCartData } from "./redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./components/Loading";
import { CSpinner, useColorModes } from "@coreui/react";
import DefaultLayout from "./srcAdmin/layout/DefaultLayout";
import "./srcAdmin/scss/style.scss";
import { WebSocketProvider } from "./WebSocket/WebSocketContext";
import ProtectedRoute from "./custom hooks/ProtectedRoute";
// Lazy load các component
const AddressForm = lazy(() => import("./components/Form/AddressForm"));
const ChangePasswordForm = lazy(() =>
  import("./components/Form/ChangePasswordForm")
);
const OrdersForm = lazy(() => import("./components/Form/OdersForm"));
const ModelTryOnHistoryForm = lazy(() =>
  import("./components/Form/ModelTryOnHistoryForm")
);
const PersonalInformationForm = lazy(() =>
  import("./components/Form/PersonalInformationForm")
);
const CartLayout = lazy(() => import("./layout/CartLayout"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ProductListPage = lazy(() => import("./pages/ProductListPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const RequireAuth = lazy(() => import("./utils/requireAuth"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("./pages/PaymentCancelPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  //config web socket topic
  const SendMaiTtopics = [
    "/topic/gmail/send",
    "/topic/room/createImage",
    "/topic/payment",
  ];

  //config admin
  const { isColorModeSet, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme =
      urlParams.get("theme") &&
      urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }
    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    dispatch(fetchUserDetail());
    if (currentUser) {
      dispatch(fetchCartData());
    }
  }, [dispatch, currentUser?.id]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <WebSocketProvider topics={SendMaiTtopics}>
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<LayoutClient />}>
              <Route
                index
                element={
                  <ScrollToTop>
                    <HomePage />
                  </ScrollToTop>
                }
              />
              <Route
                path="products"
                element={
                  <ScrollToTop>
                    <ProductListPage />
                  </ScrollToTop>
                }
              />
              <Route
                path="product/:productId"
                element={
                  <ScrollToTop>
                    <ProductDetailPage />
                  </ScrollToTop>
                }
              />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route
                path="contact"
                element={
                  <ScrollToTop>
                    <ContactPage />
                  </ScrollToTop>
                }
              />
              <Route element={<RequireAuth />}>
                <Route path="profile" element={<UserProfilePage />}>
                  <Route
                    index
                    element={<Navigate to="account-info" replace />}
                  />
                  <Route
                    path="account-info"
                    element={<PersonalInformationForm />}
                  />
                  <Route path="address-book" element={<AddressForm />} />
                  <Route
                    path="change-password"
                    element={<ChangePasswordForm />}
                  />
                  <Route path="orders" element={<OrdersForm />} />
                  <Route
                    path="model-try-on-history"
                    element={<ModelTryOnHistoryForm />}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="payment-cancel" element={<PaymentCancelPage />} />
            <Route path="payment/:code" element={<CheckoutPage />} />

            <Route path="login" element={<LoginPage />} />

            <Route index element={<CartPage />} />

            <Route path="register" element={<RegisterPage />} />
            <Route path="cart" element={<CartLayout />}>
              <Route index element={<CartPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/admin/*" element={<DefaultLayout />} /> */}
          </Routes>
        </WebSocketProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
