package com.example.demo.DTO;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

//thu nhập hàng tháng
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyIncomeDTO {
    public int monthOfYear;
    public long monthlyIncome;

}