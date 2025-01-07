package com.project.top.service;

import com.project.top.domain.User;
import com.project.top.dto.UserRegistrationDto;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public void registrationSave(UserRegistrationDto userRegistrationDto) {
        String encodedPassword = passwordEncoder.encode(userRegistrationDto.getPassword());

        User user = new User(userRegistrationDto.getLoginId(),
                encodedPassword,
                userRegistrationDto.getEmail(),
                userRegistrationDto.getPhoneNumber(),
                userRegistrationDto.getNickname());


        userRepository.save(user);
    }
}
