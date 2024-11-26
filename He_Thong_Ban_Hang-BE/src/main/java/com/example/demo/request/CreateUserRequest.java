package com.example.demo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {

    @NotNull(message = "Email rỗng")
    @NotEmpty(message = "Email rỗng")
    @Size(min = 5, max = 100, message = "Email từ 5-100 ký tự")
    @Email(message = "Email không hợp lệ")
    @Schema(description = "Email", example = "admin@gmail.com", required = true)
    private String email;

    @NotNull(message = "Mật khẩu rỗng")
    @NotEmpty(message = "Mật khẩu rỗng")
    @Size(min = 6, max = 30, message = "Mật khẩu từ 6-30 ký tự")
    @Schema(description = "Mật khẩu", example = "123456")
    private String password;

    @NotNull(message = "Số điện thoại rỗng")
    @NotEmpty(message = "Số điện thoại rỗng")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Số điện thoại phải từ 10 đến 15 số và có thể bắt đầu bằng dấu +")
    @Schema(description = "Số điện thoại", example = "+84352911750", required = true)
    private String numberPhone;

    @NotNull(message = "Họ rỗng")
    @NotEmpty(message = "Họ rỗng")
    @Size(max = 50, message = "Họ không quá 50 ký tự")
    @Schema(description = "Họ", example = "Trần", required = true)
    private String firstName;

    @NotNull(message = "Tên rỗng")
    @NotEmpty(message = "Tên rỗng")
    @Size(max = 50, message = "Tên không quá 50 ký tự")
    @Schema(description = "Tên", example = "Đức Tình", required = true)
    private String lastName;

    @NotNull(message = "Địa chỉ rỗng")
    @NotEmpty(message = "Địa chỉ rỗng")
    @Size(max = 255, message = "Địa chỉ không quá 255 ký tự")
    @Schema(description = "Địa chỉ", example = "thôn đoàn kết, chư răng, iapa, gia lai, Xã Mường Đăng, Huyện Mường Ảng, Tỉnh Điện Biên", required = true)
    private String address;

    @NotNull(message = "Ngày sinh rỗng")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Ngày sinh phải có định dạng yyyy-MM-dd")
    @Schema(description = "Ngày sinh", example = "2024-09-18", required = true)
    private String dob;
}
