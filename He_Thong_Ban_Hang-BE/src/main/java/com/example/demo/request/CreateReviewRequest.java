package com.example.demo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateReviewRequest {
    private long id;

    private String username;
    
    private String yourName;
    
    private long selectedRating;

    private String description;

}
