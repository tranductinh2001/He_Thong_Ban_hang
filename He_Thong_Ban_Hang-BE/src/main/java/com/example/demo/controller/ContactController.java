package com.example.demo.controller;

import com.example.demo.entity.Color;
import com.example.demo.entity.Contact;
import com.example.demo.request.sendMailRequest;
import com.example.demo.response.MessageResponse;
import com.example.demo.service.ClientService;
import com.example.demo.service.ColorService;
import com.example.demo.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {

    @Autowired
    private ContactService contactService;


    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả liên hệ")
    public ResponseEntity<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết liên hệ theo ID")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        Optional<Contact> contact = contactService.getContactById(id);
        return contact.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @Operation(summary = "Tạo mới một liên hệ")
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        Contact newContact = contactService.createContact(contact);
        return ResponseEntity.ok(newContact);
    }

    @PostMapping("/send-mail")
    @Operation(summary = "Tạo mới một liên hệ")
    public ResponseEntity<?> sendMail(@RequestBody sendMailRequest data) {
        return ResponseEntity.ok(contactService.sendMailContact(data)
        );
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Cập nhật thông tin liên hệ")
    public ResponseEntity<Contact> updateContact(@RequestBody Contact contact, @PathVariable Long id) {
        Contact updatedContact = contactService.updateContact(contact, id);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa liên hệ theo ID")
    public ResponseEntity<MessageResponse> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(new MessageResponse("Liên hệ đã được xóa"));
    }
}
