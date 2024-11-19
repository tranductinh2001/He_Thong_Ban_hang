import { Image } from "antd";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  return (
    <div className="flex flex-col">
      <div className="p-2 text-lg text-white bg-gray-500 rounded-t-lg">
        QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU
      </div>
      <div className="flex flex-col gap-2 p-2 sm:flex-row">
        <Link
          to={"/products?title=brand&sort=nike"}
          className="flex flex-col items-center"
        >
          <Image
            width={250}
            height={250}
            src="https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png"
            className="object-contain"
          />
          NIKE
        </Link>
        <Link
          to={`/products?title=brand&sort=adidas`}
          className="flex flex-col items-center"
        >
          <Image
            width={250}
            height={250}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png"
            className="object-contain"
          />
          ADIDAS
        </Link>
      </div>
      <div className="p-2 text-lg text-white bg-gray-500 rounded-t-lg">
        QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link className="flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZENlgnByqGFByv3_gy87iSyeUQX7uLmbnHw&s"
            className="object-contain"
          />
          MANCHESTER UNITED
        </Link>
        <Link className="flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbnXMytTr9yV_Sp3cQvZkYxWAqsJeoIlQvAQ&s"
            className="object-contain"
          />
          REAL MARID
        </Link>
      </div>
    </div>
  );
}
