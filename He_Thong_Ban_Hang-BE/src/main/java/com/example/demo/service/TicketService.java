package com.example.demo.service;

import java.util.List;

import com.example.demo.request.CreateTicketRequest;

public interface TicketService {

	void createTicket(CreateTicketRequest tk);

	List<Ticket> getListTicket();
	
	void updateTicket(CreateTicketRequest body, Long id);
	
	void deleteTicket(Long id);
	
	void deleteExpiredTickets();
	
	Long count();

	List<Ticket> getListTicketByUserId(Long id);
}
