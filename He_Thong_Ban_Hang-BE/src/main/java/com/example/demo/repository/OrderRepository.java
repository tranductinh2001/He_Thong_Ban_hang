package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query(value = "SELECT * FROM orders where verification_code LIKE %:keyword% ",nativeQuery = true)
    Order getOrderByVerificationCode(String keyword);
    List<Order> findByUserId(Long userId);

    @Query(value = "WITH RECURSIVE years AS ( " +
            "    SELECT :startYear AS year " +
            "    UNION ALL " +
            "    SELECT year + 1 " +
            "    FROM years " +
            "    WHERE year < :endYear " +
            ") " +
            "SELECT y.year, COALESCE(SUM(o.total_of_price), 0) AS total_price " +
            "FROM years y " +
            "LEFT JOIN orders o " +
            "    ON YEAR(o.created_at) = y.year " +
            "    AND o.is_deleted = 0 " +
            "GROUP BY y.year " +
            "ORDER BY y.year", nativeQuery = true)
    List<Object[]> getTotalPriceByYear(@Param("startYear") int startYear, @Param("endYear") int endYear);

    // Truy vấn theo tháng, bạn có thể truyền ngày bắt đầu tháng
    @Query(value = "WITH RECURSIVE dates AS ( " +
            "    SELECT DATE(:startDate) AS date " + // Lấy tham số startDate (ví dụ: '2024-11-01')
            "    UNION ALL " +
            "    SELECT date + INTERVAL 1 DAY " +
            "    FROM dates " +
            "    WHERE date < LAST_DAY(DATE(:startDate)) " +
            ") " +
            "SELECT d.date, COALESCE(SUM(o.total_of_price), 0) AS total_price " +
            "FROM dates d " +
            "LEFT JOIN orders o ON DATE(o.created_at) = d.date " +
            "    AND o.is_deleted = 0 " +
            "GROUP BY d.date " +
            "ORDER BY d.date", nativeQuery = true)
    List<Object[]> getTotalPriceByMonth(@Param("startDate") String startDate);
}
