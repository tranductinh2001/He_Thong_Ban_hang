package com.example.demo.service.impl;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import com.example.demo.DTO.Mail;
import com.example.demo.service.MailService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    private final SimpMessagingTemplate messagingTemplate;

    public MailServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void sendHtmlMail(Mail dataMail, String templateName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

        Context context = new Context();
        context.setVariables(dataMail.getProps());

        String html = templateEngine.process(templateName, context);

        helper.setTo(dataMail.getTo());
        helper.setSubject(dataMail.getSubject());
        helper.setText(html, true);
        String messageSK = "Đang chuẩn bị gửi email tới: " + dataMail.getTo();
        messagingTemplate.convertAndSend("/topic/gmail/send", messageSK);
        log.info(messageSK);
        try {
            // Gửi email
            mailSender.send(message);
            String messageSK1 = "Email sent successfully to: " + dataMail.getTo();
            System.out.println(messageSK1);
            messagingTemplate.convertAndSend("/topic/gmail/send", messageSK1);
        } catch (Exception e) {
            String messageSK2 = "error sending email to: " + dataMail.getTo();
            mailSender.send(message);
            messagingTemplate.convertAndSend("/topic/gmail/send", messageSK2);
            log.error("Error sending email to: " + dataMail.getTo(), e);
            throw e; // hoặc xử lý lỗi ở đây tùy theo yêu cầu của bạn
        }

    }
}
