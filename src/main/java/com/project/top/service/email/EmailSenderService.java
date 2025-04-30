package com.project.top.service.email;

public interface EmailSenderService {
    void sendEmail(String to, String subject, String text);
}
