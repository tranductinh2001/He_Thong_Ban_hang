package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionHistory {
    private String id;
    private String record_id;
    private String username;
    private String user;
    private String commandInd;
    private String tranId;
    private String clientTime;
    private String ackTime;
    private String tranType;
    private String partnerId;
    private String partnerName;
    private String amount;
    private String comment;
    private String status;
    private String desc;
    private String originalAmount;
    private String receiverType;
    private String extras;
    private String create_time;
    private String run_time;
    private String webhook_send;
    private String flag;
    private String data;
}
