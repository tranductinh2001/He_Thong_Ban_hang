package com.example.demo.service.impl;

import com.example.demo.entity.Contact;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ContactRepository;
import com.example.demo.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public Optional<Contact> getContactById(Long id) {
        return Optional.ofNullable(contactRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contact not found with id: " + id)));
    }

    @Override
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public Contact updateContact(Contact contact, Long id) {
        Contact existingContact = getContactById(id)
                .orElseThrow(() -> new NotFoundException("Contact not found with id: " + id));
        existingContact.setEmail(contact.getEmail());
        existingContact.setPhoneNumber(contact.getPhoneNumber());
        return contactRepository.save(existingContact);
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}

package com.example.demo.service.impl;

import com.example.demo.entity.Contact;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ContactRepository;
import com.example.demo.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public Optional<Contact> getContactById(Long id) {
        return Optional.ofNullable(contactRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contact not found with id: " + id)));
    }

    @Override
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public Contact updateContact(Contact contact, Long id) {
        Contact existingContact = getContactById(id)
                .orElseThrow(() -> new NotFoundException("Contact not found with id: " + id));
        existingContact.setEmail(contact.getEmail());
        existingContact.setPhoneNumber(contact.getPhoneNumber());
        return contactRepository.save(existingContact);
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}
