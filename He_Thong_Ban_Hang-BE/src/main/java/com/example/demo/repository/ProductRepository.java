package com.example.demo.repository;

import com.example.demo.entity.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByIsHot(boolean isHot, Pageable pageable);
    Page<Product> findByIsSale(boolean isSale, Pageable pageable);
    Page<Product> findByCategoryName(String categoryName, Pageable pageable);
    Page<Product> findByBrandName(String brandName, Pageable pageable);
    Page<Product> findByIsSaleTrue(Pageable pageable);
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<Product> findByCategoryId(Long categoryId);

    @Query(value = "Select * from Product order by id desc limit :number",nativeQuery = true)
    List<Product> getListNewest(int number); //lấy số Product mới

    List<Product> findByName(String name);

    List<Product> findByPrice(Long price);// tìm theo giá

    Optional<Product> findById(Long id);

    @Query(value = "SELECT t.* FROM Product t\r\n"
            + "JOIN bookings_Products bt  ON bt.Products_id = t.id\r\n"
            + "JOIN bookings b ON b.id = bt.bookings_id\r\n"
            + "JOIN user u ON b.user_id = u.id\r\n"
            + "WHERE u.username like %:name% and t.id = :id",nativeQuery = true)
    Product findListProductByIdAndUserUsername(int id, String name); //find list Product đã đặt của bảng user theo trường username;

    @Query(value = "SELECT * FROM Product WHERE destinations_id = :id",nativeQuery = true)
    List<Product> findProductByIdDestinations(Long id);


    @Query(value = "SELECT sum(t.price) FROM Product t \r\n"
            + "join bookings_Products bt on t.id = bt.Products_id\r\n"
            + "join bookings b on bt.Products_id = b.id\r\n"
            + "",nativeQuery = true)
    Long sumPriceAll();

    //thu nhập hàng ngày
    @Query(value = "SELECT DAY(b.booking_date) AS dayOfMonth, SUM(t.price) AS dailyIncome\r\n"
            + "FROM Product t \r\n"
            + "JOIN bookings_Products bt ON t.id = bt.Products_id\r\n"
            + "JOIN bookings b ON bt.Products_id = b.id\r\n"
            + "WHERE YEAR(b.booking_date) = :nam AND MONTH(b.booking_date) = :thang\r\n"
            + "GROUP BY DAY(b.booking_date);",nativeQuery = true)
    List<Map<String, Object>> sumPriceOfDay(Long thang, Long nam);

    //thu nhập hàng tháng
    @Query(value = "SELECT MONTH(b.booking_date) AS monthOfYear, SUM(t.price) AS monthlyIncome\n" +
            "FROM Product t \n" +
            "JOIN bookings_Products bt ON t.id = bt.Products_id\n" +
            "JOIN bookings b ON bt.Products_id = b.id\n" +
            "WHERE YEAR(b.booking_date) = :nam\n" +
            "GROUP BY MONTH(b.booking_date)",nativeQuery = true)
    List<Map<String, Object>> sumPriceOfMonth(Long nam);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Product WHERE id IN (SELECT id FROM (SELECT id FROM Product WHERE end_date < CURRENT_TIMESTAMP) AS subquery)",nativeQuery = true) // Xóa các ticket có endDate nhỏ hơn thời gian hiện tại
    void deleteExpiredProduct();

}
