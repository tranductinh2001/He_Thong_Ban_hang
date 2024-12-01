package com.example.demo.controller;

import com.example.demo.DTO.CartItemDTO;
import com.example.demo.DTO.ClientSendMailRequest;
import com.example.demo.entity.*;
import com.example.demo.response.PaymentMessage;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.security.service.UserDetailsImpl;
import com.example.demo.service.OrderService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
public class WebhookController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;  // Inject ProductService

    private final SimpMessagingTemplate messagingTemplate;

    private static final String VALID_SIGNATURE = "7ad215375bed512f790cd2ba621abdd097f7a3f176174a753677132bd6ae2ab3";

    private String customerName;
    private String totalAmount;
    private String specialRequest;
    private String orderAddress;

    private List<Optional<Product>> listProduct = new ArrayList<>();
    private Long QuantityOfPeople = 0L;  // Declare QuantityOfPeople

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    public WebhookController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/api/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String requestBody) throws JsonProcessingException {
        System.out.println("Webhook đã hoạt động");
        System.out.println("Dữ liệu nhận được từ webhook: " + requestBody);

        // Giải mã dữ liệu URL-encoded
        String decodedData = URLDecoder.decode(requestBody, StandardCharsets.UTF_8);
        System.out.println("Dữ liệu sau khi decode: " + decodedData);

        // Sử dụng ObjectMapper để chuyển đổi dữ liệu JSON thành đối tượng Java
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(decodedData);

        // Lấy và in ra các trường trong dữ liệu JSON
        String signature = rootNode.path("signature").asText();
        String phone = rootNode.path("phone").asText();
        String tranId = rootNode.path("tranId").asText();
        long ackTime = rootNode.path("ackTime").asLong();
        String partnerId = rootNode.path("partnerId").asText();
        String partnerName = rootNode.path("partnerName").asText();
        int amount = rootNode.path("amount").asInt();
        String comment = rootNode.path("comment").asText();
        int check = rootNode.path("check").asInt();

        System.out.println("signature: " + signature);
        System.out.println("phone: " + phone);
        System.out.println("tranId: " + tranId);
        System.out.println("ackTime: " + ackTime);
        System.out.println("partnerId: " + partnerId);
        System.out.println("partnerName: " + partnerName);
        System.out.println("amount: " + amount);
        System.out.println("comment: " + comment);
        System.out.println("check: " + check);

        List<User> users = userService.getListUserByVerificationCode(comment);
        if (!users.isEmpty()) {
            User firstUser = users.get(0);

            // Kiểm tra điều kiện thanh toán thành công
            if (firstUser.getVerificationCode().equals(comment) && amount == 5001) {
                // Tạo và lưu đơn hàng
                Order order = orderService.getOrderByVerificationCode(comment);
                order.setStatus(OrderStatus.PAID); // Trạng thái thanh toán thành công
                order.setCreatedAt(new Date());
                order.setExpiresAt(new Date());
                orderService.createOrder(order);

                // Tạo JWT cookie
                String username = firstUser.getUsername();
                String message = "Đơn hàng của bạn đã được thanh toán thành công!";

                messagingTemplate.convertAndSend("/topic/payment", new PaymentMessage(message, username));

                System.out.println("Thanh toán thành công cho user: " + firstUser.getUsername());

            } else {
                // Trường hợp thanh toán không hợp lệ
                Order order = orderService.getOrderByVerificationCode(comment);
                order.setTotalOfPrice(amount);
                order.setNumberPhone(phone);
                order.setEmail(firstUser.getEmail());
                order.setStatus(OrderStatus.CANCELED); // Trạng thái thất bại
                order.setDeleted(false);
                order.setOrderAddress(comment);
                order.setNotes("Thanh toán không thành công");
                order.setCreatedAt(new Date());

                orderService.createOrder(order);

                String message = "Thanh toán không thành công, vui lòng kiểm tra lại!";
                messagingTemplate.convertAndSend("/topic/payment", message);
                System.out.println("Thanh toán không thành công cho user: " + firstUser.getUsername());
            }
        } else {
            // Trường hợp không tìm thấy người dùng
            String message = "Không tìm thấy người dùng với mã xác nhận này!";
            messagingTemplate.convertAndSend("/topic/payment", message);
            System.out.println("Không tìm thấy người dùng với mã xác nhận: " + comment);
        }

        return ResponseEntity.ok("Dữ liệu Webhook đã được xử lý thành công");
    }

//    @PostMapping("/getTransactionHistory")
//    public ResponseEntity<String> getTransactionHistory() {
//        final String uri = "https://momosv3.apimienphi.com/api/getTransHistory";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        String accessToken = "70a7dab3322f9ceb958152a77930670a425f398f1099488a971eb69a1e39a2f5";
//        String phone = "0365854631";
//        int limit = 1;
//        int offset = 0;
//
//        String requestBody = String.format("{\"access_token\": \"%s\", \"phone\": \"%s\", \"limit\": %d, \"offset\": %d}",
//                accessToken, phone, limit, offset);
//
//        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
//
//        RestTemplate restTemplate = new RestTemplate();
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, request, String.class);
//
//            if (response.getStatusCode() == HttpStatus.OK) {
//                String responseBody = response.getBody();
//
//                if (responseBody == null || responseBody.isEmpty()) {
//                    return ResponseEntity.badRequest().body("Phản hồi không chứa dữ liệu.");
//                }
//
//                ObjectMapper mapper = new ObjectMapper();
//
//                // Kiểm tra nếu API trả về lỗi
//                JsonNode rootNode = mapper.readTree(responseBody);
//                if (rootNode.has("error") && rootNode.get("error").asInt() != 0) {
//                    String errorMessage = rootNode.get("msg").asText();
//                    return ResponseEntity.badRequest().body("API trả về lỗi: " + errorMessage);
//                }
//
//                // Giải tuần tự hóa dữ liệu 'data' thành mảng TransactionHistory[]
//                JsonNode dataNode = rootNode.get("data");
//                if (dataNode.isArray()) {
//                    TransactionHistory[] transactions = mapper.readValue(dataNode.toString(), TransactionHistory[].class);
//
//                    return ResponseEntity.ok("Dữ liệu lịch sử giao dịch đã được xử lý thành công.");
//                } else {
//                    return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: Không có mảng 'data'.");
//                }
//            } else {
//                return ResponseEntity.status(response.getStatusCode()).body("Lỗi khi gọi API: " + response.getStatusCode());
//            }
//        } catch (HttpClientErrorException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(e.getStatusCode()).body("Lỗi HTTP: " + e.getMessage());
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.badRequest().body("Lỗi khi xử lý JSON: " + e.getMessage());
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.internalServerError().body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
//        }
//    }
//


    @PostMapping("/sendMail")
    public String PigdtaMail(@RequestBody ClientSendMailRequest sdi) {

        // Lấy tổng số tiền từ yêu cầu gửi mail
        System.out.println("sdi.getTotal() số tiền chuyển gốc: " + sdi.getTotalOfPrice());
        totalAmount = String.valueOf(sdi.getTotalOfPrice()); // 6000k
        System.out.println("totalAmount: số tiền cần phải thanh toán khi đã trừ: " + totalAmount);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Lấy tên khách hàng và yêu cầu đặc biệt
        customerName = userDetails.getUsername();
        specialRequest = sdi.getNotes();
        orderAddress = sdi.getOrderAddress();
        // Danh sách các CartItemDTO trong yêu cầu
        List<CartItemDTO> carts = sdi.getCart();

        // Reset danh sách các sản phẩm và tổng số lượng
        listProduct.clear();
        QuantityOfPeople = 0L;

        // Kiểm tra giỏ hàng không rỗng
        if (carts == null || carts.isEmpty()) {
            return "Giỏ hàng trống";
        }

        // Duyệt qua từng CartItemDTO
        for (CartItemDTO cartDTO : carts) {
            Long id = cartDTO.getProduct().getId(); // Lấy ID của sản phẩm từ CartItemDTO

            // Lấy thông tin sản phẩm từ service, sử dụng Product entity thay vì ProductDTO
            Optional<Product> product = productService.getProductById(id);
            if (product != null) {
                listProduct.add(product);  // Thêm Product vào danh sách listProduct

                // Lấy số lượng sản phẩm trong giỏ
                int count = cartDTO.getCount();  // if it returns an int
                Long quantity = Long.valueOf(count);  // Convert int to Long

                QuantityOfPeople += quantity;  // Cộng dồn số lượng vào tổng số

                // In thông tin chi tiết của CartItemDTO
                String productName = product.map(Product::getName).orElse("Sản phẩm không tìm thấy");
                System.out.println("Tên sản phẩm: " + productName);
                System.out.println("Số lượng: " + quantity);
                System.out.println("Kích cỡ: " + cartDTO.getSize()); // Lấy kích cỡ từ SizeDTO

            } else {
                // Xử lý khi không tìm thấy sản phẩm
                System.out.println("Product with ID " + id + " not found.");
            }
        }

        System.out.println("Tổng số lượng sản phẩm trong giỏ hàng: " + QuantityOfPeople);
        return "Thông tin giỏ hàng đã được xử lý thành công!";
    }

    public static String trimJson(String jsonString) {
        int startIndex = jsonString.indexOf("[");
        int lastIndex = jsonString.lastIndexOf("]") + 1;

        if (startIndex != -1 && lastIndex != -1 && startIndex < lastIndex) {
            return jsonString.substring(startIndex, lastIndex);
        }

        return "";
    }

}
