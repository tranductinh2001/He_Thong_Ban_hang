package com.example.demo.DTO;

import java.util.Date;
import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String numberPhone;
    private String address;
    private Boolean isDeleted;
    private Date dob;
    private Date createdAt;
    private Date updatedAt;
    private boolean enabled;

    // DTO cho các entity khác
    private CartDTO cart;
    private List<OrderDTO> orders;
    private List<OrderAddressDTO> orderAddresses;
    private Set<RoleDTO> roles;
}
