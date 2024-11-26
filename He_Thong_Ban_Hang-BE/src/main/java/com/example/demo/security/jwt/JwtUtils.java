package com.example.demo.security.jwt;

import java.util.Date;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;  // Thêm import này
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.example.demo.security.service.UserDetailsImpl;

import javax.crypto.SecretKey;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwtSecret}")
    private String jwtSecret; // Mã hóa bí mật, có thể thay bằng một giá trị mạnh hơn nếu cần

    @Value("${jwtCookieName}")
    private String jwtCookie;

    private int jwtExpirationMs = 24 * 60 * 60 * 1000; // 1 ngày

    // Lấy JWT từ cookie
    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookie);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }

    // Tạo JWT từ UserDetailsImpl
    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateTokenFromUsername(userPrincipal.getUsername());
        long jwtExpirationSeconds = jwtExpirationMs / 1000;
        ResponseCookie cookie = ResponseCookie.from(jwtCookie, jwt)
                .path("/api")
                .maxAge(jwtExpirationSeconds)
                .httpOnly(true)
                .build();
        return cookie;
    }

    // Xóa JWT từ cookie
    public ResponseCookie getCleanJwtCookie() {
        ResponseCookie cookie = ResponseCookie.from(jwtCookie, null).path("/api").build();
        return cookie;
    }

    // Lấy tên người dùng từ JWT
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()  // Sử dụng parserBuilder thay cho parser
                .setSigningKey(jwtSecret.getBytes())  // Cung cấp khóa bí mật
                .build()  // Xây dựng JwtParser
                .parseClaimsJws(token)  // Phân tích JWT
                .getBody()  // Lấy thông tin body
                .getSubject();  // Lấy subject từ claims
    }

    // Xác thực token JWT
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()  // Sử dụng parserBuilder thay cho parser
                    .setSigningKey(jwtSecret.getBytes())  // Cung cấp khóa bí mật
                    .build()  // Xây dựng JwtParser
                    .parseClaimsJws(authToken);  // Phân tích JWT
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // Tạo JWT từ username
    public String generateTokenFromUsername(String username) {
        // Tạo khóa bí mật an toàn cho HS512
        SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);  // Tạo khóa mạnh cho HS512

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(secretKey)  // Sử dụng khóa bí mật an toàn cho HS512
                .compact();
    }
}
