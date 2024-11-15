import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { login } from "../redux/slices/authSlice";

export default function LoginPage() {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const errorMessages = useSelector((state) => state.auth.errorMessages);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });
  const from = location.state?.from || "/";
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(payload));
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, currentUser]);

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex min-h-full bg-white shadow-lg rounded-md flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-full max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <Link to="/" className="hover:opacity-50">
            <img src={logo} alt="" className="h-28" />
          </Link>
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Đăng nhập
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium leading-6 text-gray-900"
              >
                Địa chỉ email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={payload.email}
                  onChange={(e) => {
                    setPayload((prevState) => ({
                      ...prevState,
                      email: e.target.value,
                    }));
                  }}
                  className="block w-full h-16 pl-4 focus:outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Mật khẩu
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={payload.password}
                  onChange={(e) => {
                    setPayload((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }));
                  }}
                  className="block pl-4 h-16 focus:outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="text-red-500 mt-2">
                {errorMessages ? (
                  <Alert message={errorMessages} type="error" />
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 text-center">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
              {/* <div class="g-signin2" data-onsuccess="onSignIn">
                Login with Google
              </div> */}
              {/* <Link to="/" className="text-blue-500 underline">
                Trang chủ
              </Link> */}
            </div>
          </form>
          <p className="mt-10 text-center text-lg text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
