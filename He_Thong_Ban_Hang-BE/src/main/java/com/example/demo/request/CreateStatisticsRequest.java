package com.example.demo.request;

import java.util.Date;
import java.util.Set;
import jakarta.persistence.*;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateStatisticsRequest {

    private long id;
    
    private Date time;//Một trường để lưu trữ thời gian thống kê, có thể là ngày, tháng, quý hoặc năm.
    
    private long revenue; // doanh thu theo time 
    
    private long customerCount; // số lượng khách hàng 
    
    private long soldToursCount;  // số lượng tour đã bán 
    
    private String description;
}
