package com.project.top.initializer;

import com.project.top.domain.User;
import com.project.top.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class SystemUserInitializer {

    private final UserRepository userRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        if (userRepository.findByNickname("[시스템]").isEmpty()) {
            log.info("시스템 유저 생성 중 ...");

            User systemUser = new User();
            systemUser.setLoginId("system_id");
            systemUser.setPassword("system_password");
            systemUser.setEmail("system_email");
            systemUser.setPhoneNumber("system_phone_number");
            systemUser.setNickname("[시스템]");

            userRepository.save(systemUser);

            log.info("시스템 유저 생성 완료");
        } else {
            log.info("시스템 유저기 이미 존재합니다.");
        }
    }
}
