package com.example.demo.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {

    private String username;

    private String firstname;

    private String lastname;

    private String email;

    private String country;

    private Date dob;

    private String address;

    private String phone;

    private String avatarUrl;

}
