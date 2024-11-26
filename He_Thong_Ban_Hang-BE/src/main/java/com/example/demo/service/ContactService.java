package com.example.demo.service;

import com.example.demo.entity.Contact;
import java.util.List;
import java.util.Optional;

public interface ContactService {

    List<Contact> getAllContacts();

    Optional<Contact> getContactById(Long id);

    Contact createContact(Contact contact);

    Contact updateContact(Contact contact, Long id);

    void deleteContact(Long id);
}
