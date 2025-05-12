package com.project.top.verification;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class EmailVerificationStorage {

    private final Map<String, EmailAuthObject> emailAuthMap = new ConcurrentHashMap<>();

    public void saveCode(String email, String code) {
        emailAuthMap.put(email, new EmailAuthObject(code, LocalDateTime.now()));
    }

    public boolean verifyCode(String email, String code) {
        EmailAuthObject emailAuth = emailAuthMap.get(email);

        if (emailAuth == null) {
            return false;
        }

        if (Duration.between(emailAuth.getIssuedTime(), LocalDateTime.now()).toMinutes() >= 3) {
            emailAuthMap.remove(email);
            return false;
        }

        boolean isValid = emailAuth.getCode().equals(code);

        if (isValid) {
            emailAuthMap.remove(email);
        }

        return isValid;
    }

    public void removeCode(String email) {
        emailAuthMap.remove(email);
    }
}
