package com.example.demo.repository;

import com.example.demo.entity.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>{

    @Modifying
    @Transactional
	@Query(value = "DELETE FROM Ticket WHERE id IN (SELECT id FROM (SELECT id FROM Ticket WHERE end_date < CURRENT_TIMESTAMP) AS subquery)",nativeQuery = true) // Xóa các ticket có endDate nhỏ hơn thời gian hiện tại
    void deleteExpiredTickets();

    List<Ticket> findAllByUserId(long userId);

}
