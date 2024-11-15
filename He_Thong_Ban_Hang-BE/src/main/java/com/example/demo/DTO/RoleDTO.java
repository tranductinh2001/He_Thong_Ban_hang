package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {

    private long id;
    private String name;  // Thay vì ERole, chuyển thành String để dễ dàng sử dụng trong JSON

}
