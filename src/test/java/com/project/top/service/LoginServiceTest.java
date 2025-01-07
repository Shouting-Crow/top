package com.project.top.service;

import com.project.top.domain.User;
import com.project.top.dto.LoginDto;
import com.project.top.dto.LoginResponseDto;
import com.project.top.repository.UserRepository;
import com.project.top.util.JwtTokenProvider;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest
@Transactional
class LoginServiceTest {

    @Autowired
    private LoginService loginService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void loginSuccessTest() {
        User user = new User("test1", passwordEncoder.encode("test1234"),
                "test@gmail.com", "01012345678", "테스트");
        userRepository.save(user);

        LoginDto loginDto = new LoginDto();
        loginDto.setLoginId("test1");
        loginDto.setPassword("test1234");

        LoginResponseDto response = loginService.login(loginDto);

        Assertions.assertEquals(response.getLoginId(), "test1");
        Assertions.assertNotNull(response.getToken());
        Assertions.assertEquals(response.getRole(), "ROLE_USER");

        String usernameFromToken = new JwtTokenProvider().getUsernameFromToken(response.getToken());
        Assertions.assertEquals(usernameFromToken, "test1");

    }

    @Test
    public void loginFailTest() {
        LoginDto worngLoginDto = new LoginDto();
        worngLoginDto.setLoginId("test2");
        worngLoginDto.setPassword("test1234");

        Assertions.assertThrows(IllegalArgumentException.class, () -> loginService.login(worngLoginDto));
    }

}