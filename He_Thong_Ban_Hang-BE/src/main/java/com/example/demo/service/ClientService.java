package com.example.demo.service;

import com.example.demo.DTO.ClientSendMailContactAuto;
import com.example.demo.DTO.ClientSendMailRequest;

public interface ClientService {
    Boolean create(ClientSendMailRequest sdi);

    void createMailAutoContact(ClientSendMailContactAuto sdi);
    Boolean createMailContact(ClientSendMailContactAuto sdi);
}
