import { useEffect, useState, useRef } from "react";
import { CCardBody, CCardHeader, CRow, CButton } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import imageRequests from "../../../redux/request/imageRequests.js";
import ReactPlayer from "react-player";

import {
  fetchProductList,
  setActiveFilter,
} from "../../../redux/slices/productSlice";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Tag,
  Popconfirm,
  Modal,
  message,
  Upload,
  Tooltip,
  Layout,
} from "antd";
const { Header, Footer, Content } = Layout;
import { fetchCategoryList } from "../../../redux/slices/categorySlice.js";
import { fetchBrandList } from "../../../redux/slices/brandSlice.js";
import { fetchColorList } from "../../../redux/slices/colorSlice.js";
import { fetchSizeList } from "../../../redux/slices/sizeSlice.js";

import Highlighter from "react-highlight-words";
import ProductForm from "../forms/FormAdmin/ProductForm/ProductForm.jsx";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import backgroundYTB from "../../../assets/backgroundYTB.png";
import productRequests from "../../../redux/request/productRequests.js";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
const ProductManager = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [csvData, setCsvData] = useState([]); // State để lưu dữ liệu CSV đã phân tích
  const categories = useSelector((state) => state.category.categoryList);
  const brands = useSelector((state) => state.brand.brandList);
  const colors = useSelector((state) => state.color.colorList);
  const sizes = useSelector((state) => state.size.sizeList);
  const [size, setSize] = useState("large"); // default is 'middle'
  useEffect(() => {
    dispatch(fetchCategoryList());
    dispatch(fetchBrandList());
    dispatch(fetchColorList());
    dispatch(fetchSizeList());
  }, [dispatch]);

 //console.log("sizes:", sizes);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4096ff",
  };
  const contentStyle = {
    textAlign: "center",
    minHeight: 120,
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "#0958d9",
  };
  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#4096ff",
  };
  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "calc(50% - 8px)",
    maxWidth: "calc(50% - 8px)",
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 70,
      ...getColumnSearchProps("id"),
    },

    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      editable: true,
      ...getColumnSearchProps("name"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "image",
      render: (images) =>
        images && images.length > 0 ? (
          <img
            src={images[0]?.url} // Đảm bảo `url` là thuộc tính chứa đường dẫn ảnh
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      ...getColumnSearchProps("price"),
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Thể loại",
      dataIndex: ["category", "name"],
      key: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Nhãn hàng",
      dataIndex: ["brand", "name"],
      key: "brand",
      ...getColumnSearchProps("brand", "name"),
    },
    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      ...getColumnSearchProps("colors"),
      render: (colors) => (
        <>
          {colors?.map((color) => (
            <Tag key={color.id}>{color.name}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeList",
      key: "sizeList",
      ...getColumnSearchProps("sizelist"),
      render: (sizes) => (
        <>
          {sizes?.map((size) => (
            <Tag key={size.id}>{size?.sizeName}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Hot",
      dataIndex: "hot",
      key: "hot",
      ...getColumnSearchProps("hot"),
      render: (hot) => (
        <Tag color={hot ? "gold" : "default"}>{hot ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
      ...getColumnSearchProps("sale"),
      render: (sale) => (
        <Tag color={sale ? "green" : "default"}>{sale ? "On Sale" : "No"}</Tag>
      ),
    },
    {
      title: "Giá sale",
      dataIndex: "salePrice",
      key: "salePrice",
      ...getColumnSearchProps("salePrice"),
      render: (salePrice) =>
        salePrice ? `${salePrice.toLocaleString()} VND` : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      ...getColumnSearchProps("updatedAt"),
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          {[
            { color: "info", label: "Sửa" },
            {
              color: "danger",
              label: "Xóa",
              isDelete: true,
            },
          ]?.map((item, index) =>
            item.isDelete ? (
              <Popconfirm
                key={index}
                title="Bạn chắc chắn xoá chứ?"
                onConfirm={() => handleDelete(record.id)}
              >
                <CButton color={item.color} shape="rounded-pill">
                  {item.label}
                  {item.name && (
                    <span style={{ fontWeight: "bold", color: "#FFA500" }}>
                      {" " + item.name}
                    </span>
                  )}
                </CButton>
              </Popconfirm>
            ) : (
              <CButton
                color={item.color}
                shape="rounded-pill"
                key={index}
                onClick={() => showModal("edit", record)}
              >
                {item.label}
                {item.name && (
                  <span style={{ fontWeight: "bold", color: "#FFA500" }}>
                    {" " + item.name}
                  </span>
                )}
              </CButton>
            )
          )}
        </Space>
      ),
    },
  ];

  //config table
  const { styles } = useStyle();
  const productListByPage = useSelector(
    (state) => state.products.combinedProductList
  );

 //console.log(productListByPage);

  const totalProductItems = useSelector(
    (state) => state.products.totalProductItems
  );
  const pageSize = 15;

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (Number.isInteger(currentPage) && currentPage >= 1) {
      dispatch(setActiveFilter({ title: 0, sort: 0 }));
      dispatch(fetchProductList({ currentPage: currentPage, pageSize }));
    }
  }, [dispatch, currentPage]);

  const handleTableChange = (pagination) => {
    if (pagination && pagination.current !== undefined) {
      setCurrentPage(pagination.current);
    }
  };

  //handle delete
  const handleDelete = async (productId) => {
    await productRequests.delete(productId);
    dispatch(setActiveFilter({ title: 0, sort: 0 }));
    dispatch(fetchProductList({ currentPage: currentPage, pageSize }));
    message.success("Xoá sản phẩm thành công!");
  };

  //config handle show form edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [typeModal, setTypeModal] = useState("");

  const showModal = (type, record) => {
    setSelectedRecord(record); // Lưu thông tin sản phẩm để chỉnh sửa
    setTypeModal(type);
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  const handleExcelUpload = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        // Đọc file Excel
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Chọn sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(sheet); // Chuyển đổi thành JSON

        // Gợi ý chọn thư mục chứa ảnh
        const directoryHandle = await window.showDirectoryPicker();

        // Xử lý từng dòng dữ liệu từ file Excel
        data = await Promise.all(
          data.map(async (row) => {
            const imageNames = row.images ? row.images.split(",") : []; // Tên các ảnh
            const uploadedImages = [];

            for (let imageName of imageNames) {
              imageName = imageName.trim();
              try {
                const fileHandle = await directoryHandle.getFileHandle(
                  imageName,
                  { create: false }
                );
                const file = await fileHandle.getFile();
                uploadedImages.push(file); // Lưu file vào danh sách nếu tồn tại
              } catch (err) {
                console.warn(`Không tìm thấy file: ${imageName}`);
              }
            }

            // Tải lên tất cả ảnh
            const formData = new FormData();
            uploadedImages.forEach((image) => {
              formData.append("file", image);
            });

            const uploadResponse = formData.has("file")
              ? await imageRequests.upload(formData) // API upload ảnh
              : [];

            // Lấy danh sách ID của ảnh đã upload
            const imageUrls = uploadResponse?.map((img) => img.id);

            return {
              ...row, // Dữ liệu khác từ file Excel
              images: imageUrls, // Danh sách ID của ảnh
            };
          })
        );

       //console.log("data trước khi lưu product ", data);

        // Gửi dữ liệu sản phẩm lên backend
        await processExcelData(data);
        message.success("Thêm sản phẩm từ Excel thành công!");
      } catch (err) {
        console.error("Lỗi khi xử lý file Excel hoặc thư mục:", err);
        message.error("Có lỗi xảy ra khi xử lý file Excel!");
      }
    };

    reader.readAsBinaryString(file);
  };

  const processExcelData = async (data) => {
    try {
      for (const item of data) {
        const product = {
          name: item["Tên"],
          price: parseFloat(item["Giá(VND)"]),
          description: item["Mô tả"],
          categoryId:
            categories.find((c) => c.name === item["Thể loại"])?.id || null,
          brandId: brands.find((b) => b.name === item["Nhãn hàng"])?.id || null,

          // Chuyển đổi dữ liệu cho "sizes" thành danh sách các đối tượng SizeRequest
          sizes: item["Kích cỡ"]
            ? item["Kích cỡ"]
                .split(",")
                .map((size) => {
                  const foundSize = sizes.find(
                    (s) => s.sizeName === size.trim()
                  );
                  return foundSize
                    ? {
                        id: foundSize.id,
                        sizeName: foundSize.sizeName,
                        quantity: foundSize.quantity,
                      }
                    : null;
                })
                .filter((size) => size !== null) // Lọc các phần tử null ra khỏi mảng
            : [], // Nếu không có kích cỡ, trả về mảng rỗng

          // Chuyển đổi dữ liệu cho "colors" thành danh sách ID màu sắc
          colors: item["Màu sắc"]
            ? item["Màu sắc"]
                .split(",")
                .map((color) => colors.find((c) => c.name === color.trim())?.id)
                .filter((id) => id !== undefined) // Lọc ra các màu không tìm thấy
            : [],

          images: item.images || [], // Đảm bảo images có giá trị hợp lệ
          hot: item["Hot"] === 1, // So sánh với 1 để lấy giá trị boolean
          sale: item["Sale"] === 1, // So sánh với 1 để lấy giá trị boolean
          salePrice: item["Giá sale(VND)"]
            ? parseFloat(item["Giá sale(VND)"])
            : null,
          status: item["Trạng thái"] || null,
          createdAt: item["Ngày tạo"] || null,
          updatedAt: item["Ngày cập nhật"] || null,
        };

       //console.log("product  ", product);
        // Gửi request tạo sản phẩm
        await productRequests.create(product);
      }

      message.success("Tạo sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi tạo sản phẩm:", err);
      message.error("Không thể tạo sản phẩm từ Excel!");
    }
  };


  const beforeUpload = (file) => {
    const isExcel =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      message.error("Chỉ được upload file Excel (.xlsx)!");
      return Upload.LIST_IGNORE;
    }

    handleExcelUpload(file);
    return false; // Ngăn mặc định upload file
  };

  return (
    <CRow>
      <CCardHeader className="justifil-conter">
        <strong>Quản lý danh sách sản phẩm</strong>
      </CCardHeader>
      <CCardBody>
        <div>
          <div className="flex flex-col ">
            <div className="flex items-center justify-between p-2">
              {/* Nút "Thêm sản phẩm" ở đầu hàng */}
              <Button
                type="primary"
                className="mr-4" // Khoảng cách phải của nút "Thêm sản phẩm"
                onClick={() => showModal("create", null)}
              >
                Thêm sản phẩm
              </Button>

              <div className="flex gap-4">
                <Upload beforeUpload={beforeUpload} accept=".xlsx">
                  <Tooltip title="Đọc lưu ý gì trước khi tải lên">
                    <Button icon={<UploadOutlined />}>Upload Excel</Button>
                  </Tooltip>
                </Upload>
                <div className="flex flex-col items-center">
                  <Tooltip title="Tải xuống công cụ">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<DownloadOutlined />}
                      size={size}
                      href="http://localhost:8080/photos/download/rename_tool_image.exe"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <Table
            scroll={{
              x: "max-content",
              y: 55 * 10,
            }}
            rowClassName="editable-row"
            bordered
            columns={columns}
            dataSource={productListByPage}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalProductItems,
            }}
            onChange={handleTableChange}
            rowKey="id"
            className={styles.customTable}
          />
        </div>

        <CCardHeader className="justifil-conter">
          <strong>Hướng dẫn thêm sản phẩm số lượng lớn</strong>
        </CCardHeader>

        {/* Container video */}
        <div
          className="relative pb-[56.25%] bg-cover bg-center rounded-lg shadow-lg hover:shadow-2xl transition-all duration-100 mt-16"
          style={{ backgroundImage: `url(${backgroundYTB})` }}
        >
          {/* Lớp phủ mờ cho ảnh nền, không ảnh hưởng đến video */}
          <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>

          {/* ReactPlayer */}
          <ReactPlayer
            url="https://www.youtube.com/watch?v=s4v9vDGd4Ic"
            controls
            width="100%"
            height="100%"
            className="absolute top-0 left-0 rounded-lg z-10"
          />
        </div>

        <Modal
          title={
            typeModal === "edit" ? "Chỉnh sửa sản phẩm" : "Tạo mới sản phẩm"
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null} // Nếu không muốn có nút footer
        >
          <ProductForm setIsModalVisible={setIsModalVisible} type={typeModal} product={selectedRecord} />
        </Modal>
      </CCardBody>
    </CRow>
  );
};

export default ProductManager;
