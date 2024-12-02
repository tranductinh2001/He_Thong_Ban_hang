package com.example.demo.service.impl;

import com.example.demo.DTO.ClientSendMailContactAuto;
import com.example.demo.entity.Contact;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.ContactRepository;
import com.example.demo.request.sendMailRequest;
import com.example.demo.service.ClientService;
import com.example.demo.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ClientService clientService;

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
        ClientSendMailContactAuto clientSendMailContactAuto = new ClientSendMailContactAuto();
        // Map các thông tin từ Contact sang ClientSendMailContactAuto
        clientSendMailContactAuto.setEmail(contact.getEmail());
        clientSendMailContactAuto.setNotes(contact.getNotes());
        clientSendMailContactAuto.setNumberPhone(contact.getPhoneNumber());
        clientSendMailContactAuto.setFullname(contact.getFullName());

        clientService.createMailAutoContact(clientSendMailContactAuto);
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

    @Override
    public boolean sendMailContact(sendMailRequest data) {
        ClientSendMailContactAuto clientSendMailContactAuto = new ClientSendMailContactAuto();

        clientSendMailContactAuto.setEmail(data.getEmail());
        clientSendMailContactAuto.setNotes(data.getNotes());
        clientSendMailContactAuto.setNumberPhone(data.getNumberPhone());
        clientSendMailContactAuto.setFullname(data.getFullName());

        return clientService.createMailContact(clientSendMailContactAuto);
    }
}
