package com.example.demo.request;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.example.demo.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingsRequest {

    @NotNull(message = "custommer rỗng")
    @NotEmpty(message = "custommer rỗng")
    private String customerName;

    private String tourType;

    private Date bookingDate;
    
    private String status;

    private List<Tour> tours;
    
    private User user;
}
