package com.example.demo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String numberPhone;
    private String password;
    private String avatarUrl;
    private String address;
    private Date dob;
}
