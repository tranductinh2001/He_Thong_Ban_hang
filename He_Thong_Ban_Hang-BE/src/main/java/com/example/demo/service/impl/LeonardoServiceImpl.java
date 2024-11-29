package com.example.demo.service.impl;

import com.example.demo.service.LeonardoService;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.entity.mime.FileBody;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpResponse;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

@Service
public class LeonardoServiceImpl implements LeonardoService {

    private static final Logger logger = LoggerFactory.getLogger(LeonardoServiceImpl.class);

    @Value("${leonardo.api.key}")
    private String API_KEY;

    private static final String BASE_URL = "https://cloud.leonardo.ai/api/rest/v1/";
    private static final String AUTHORIZATION = "Bearer ";

    @Override
    public JSONObject processImageGeneration(String imagePath, String prompt, String modelId) throws IOException, InterruptedException {
        try {
            // Step 1: Get presigned URL and image ID
            JSONObject uploadInitImage = getPresignedUrl();
            String uploadUrl = uploadInitImage.optString("url");
            String imageId = uploadInitImage.optString("id");

            // Step 2: Upload the image
            File imageFile = new File(imagePath);
            uploadImage(uploadUrl, imageFile, uploadUrl);

            // Step 3: Generate the image
            String generationId = generateImage(modelId, prompt, imageId);

            // Step 4: Poll for the generated image
            String finalResponse = pollForImageGeneration(generationId);

            // Return the generated image details
            return new JSONObject(finalResponse);
        } catch (JSONException | IOException | ParseException e) {
            logger.error("Error processing image generation: {}", e.getMessage());
            throw new RuntimeException("Error processing image generation: " + e.getMessage(), e);
        }
    }

    private String generateImage(String modelId, String prompt, String imageId) throws IOException {
        HttpPost generateRequest = new HttpPost(BASE_URL + "generations");
        generateRequest.setHeader("Authorization", AUTHORIZATION + API_KEY);
        generateRequest.setHeader("Content-Type", "application/json");

        JSONObject generatePayload = new JSONObject();
        try {
            generatePayload.put("height", 512);
            generatePayload.put("width", 512);
            generatePayload.put("modelId", modelId);
            generatePayload.put("prompt", prompt);
            generatePayload.put("imagePrompts", new JSONArray().put(imageId));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        generateRequest.setEntity(new StringEntity(generatePayload.toString()));

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse generateResponse = client.execute(generateRequest)) {
            int statusCode = generateResponse.getCode();
            if (statusCode != 200) {
                throw new RuntimeException("Failed to initiate image generation. HTTP Status: " + statusCode);
            }

            JSONObject generateResponseJson = new JSONObject(EntityUtils.toString(generateResponse.getEntity()));
            return generateResponseJson.getJSONObject("sdGenerationJob").getString("generationId");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }


    public void uploadImage(String uploadUrl, File imageFile, String key) throws IOException {
        if (imageFile.exists() && imageFile.isFile()) {
            logger.info("File hợp lệ, chuẩn bị upload.");

            HttpPost uploadRequest = new HttpPost(uploadUrl);

            // Tạo multipart entity để gửi tệp tin và thêm trường 'key'
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addPart("file", new FileBody(imageFile));
            builder.addTextBody("key", key);  // Thêm trường 'key' vào yêu cầu

            // Để MultipartEntityBuilder tự động thiết lập Content-Type
            uploadRequest.setEntity(builder.build());

            // Sử dụng try-with-resources để đảm bảo đóng HttpClient sau khi sử dụng
            try (CloseableHttpClient client = HttpClients.createDefault();
                 CloseableHttpResponse uploadResponse = client.execute(uploadRequest)) {

                // Kiểm tra mã lỗi HTTP và xử lý phản hồi
                int statusCode = uploadResponse.getCode();
                if (statusCode != 200) {
                    // Đọc chi tiết phản hồi để tìm hiểu nguyên nhân
                    String responseBody = EntityUtils.toString(uploadResponse.getEntity());
                    throw new RuntimeException("Failed to upload image. HTTP Status: " + statusCode + ", Response: " + responseBody);
                }

                logger.info("Tệp đã được upload thành công.");

            } catch (IOException e) {
                logger.error("Lỗi khi tải lên hình ảnh", e);
                throw e;
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }

        } else {
            logger.warn("Không thể tìm thấy tệp hoặc tệp không hợp lệ.");
            throw new FileNotFoundException("Tệp không tồn tại hoặc không hợp lệ.");
        }
    }


    private JSONObject getPresignedUrl() throws IOException, ParseException {
        HttpPost initImageRequest = new HttpPost(BASE_URL + "init-image");
        initImageRequest.setHeader("Authorization", AUTHORIZATION + API_KEY);
        initImageRequest.setHeader("Content-Type", "application/json");

        JSONObject initPayload = new JSONObject();
        try {
            initPayload.put("extension", "jpg");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        initImageRequest.setEntity(new StringEntity(initPayload.toString()));

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse initResponse = client.execute(initImageRequest)) {

            int statusCode = initResponse.getCode();
            String responseContent = EntityUtils.toString(initResponse.getEntity());
            logger.info("Response from init-image API: {}", responseContent);

            if (statusCode != 200) {
                throw new RuntimeException("Failed to get init image response. HTTP Status: " + statusCode);
            }

            JSONObject initResponseJson = null;
            try {
                initResponseJson = new JSONObject(responseContent);
            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
            JSONObject uploadInitImage = initResponseJson.optJSONObject("uploadInitImage");

            if (uploadInitImage == null) {
                throw new RuntimeException("Missing 'uploadInitImage' in response: " + responseContent);
            }

            return uploadInitImage;
        }
    }

    private String pollForImageGeneration(String generationId) throws IOException, InterruptedException {
        String finalResponse = null;
        boolean isGenerationComplete = false;
        int retries = 0;
        int maxRetries = 10;

        while (!isGenerationComplete && retries < maxRetries) {
            Thread.sleep(5000); // Wait for 5 seconds before checking the status
            retries++;

            HttpGet generationStatusRequest = new HttpGet(BASE_URL + "generations/" + generationId);
            generationStatusRequest.setHeader("Authorization", AUTHORIZATION + API_KEY);

            try (CloseableHttpClient client = HttpClients.createDefault();
                 CloseableHttpResponse statusResponse = client.execute(generationStatusRequest)) {
                String responseContent = EntityUtils.toString(statusResponse.getEntity());
                JSONObject statusJson = new JSONObject(responseContent);
                String status = statusJson.getJSONObject("sdGenerationJob").getString("status");

                if ("completed".equalsIgnoreCase(status)) {
                    isGenerationComplete = true;
                    finalResponse = responseContent;
                }
            } catch (IOException | JSONException | ParseException e) {
                logger.error("Error checking generation status: {}", e.getMessage());
            }
        }

        if (!isGenerationComplete) {
            throw new RuntimeException("Image generation failed to complete after max retries.");
        }

        return finalResponse;
    }


}
