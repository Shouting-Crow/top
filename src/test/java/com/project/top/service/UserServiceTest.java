package com.project.top.service;

import com.project.top.domain.User;
import com.project.top.dto.UserDto;
import com.project.top.dto.UserRegistrationDto;
import com.project.top.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback(false)
@Slf4j
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void userRegistrationTest(){
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setLoginId("newmember1");
        dto.setPassword("1q2w3e4r!");
        dto.setEmail("newmember1@gmail.com");
        dto.setPhoneNumber("01012345678");
        dto.setNickname("개발자1");

        userService.registrationSave(dto);

        User user = userRepository.findByLoginId(dto.getLoginId()).orElseThrow(RuntimeException::new);

        Assertions.assertEquals(user.getLoginId(),"newmember1");
        Assertions.assertTrue(passwordEncoder.matches("1q2w3e4r!", user.getPassword()));
        Assertions.assertEquals(user.getEmail(),"newmember1@gmail.com");
        Assertions.assertEquals(user.getPhoneNumber(),"01012345678");
    }

    @Test
    void updateUserTest(){
        UserDto newUserDto = new UserDto();
        User oldUser = userRepository.findById(6L).get();

        newUserDto.setPassword(passwordEncoder.encode("1q2w3e4r!!!"));
        newUserDto.setNickname("새로운닉네임");
        newUserDto.setEmail("newtest@gmail.com");
        newUserDto.setPhoneNumber("010-2222-3333");

        userService.updateUser(6L, newUserDto);

        User newUser = userRepository.findById(6L).orElseThrow(RuntimeException::new);

        Assertions.assertEquals(newUser.getLoginId(),oldUser.getLoginId());
        Assertions.assertEquals("새로운닉네임", newUser.getNickname());

        log.info("old user email : {}", oldUser.getEmail());
        log.info("new user email : {}", newUser.getEmail());
    }

    @Test
    void deleteUserTest() {
        userService.deleteUser(6L);
    }

}