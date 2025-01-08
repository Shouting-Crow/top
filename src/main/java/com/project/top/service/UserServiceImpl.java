package com.project.top.service;

import com.project.top.domain.User;
import com.project.top.dto.UserDto;
import com.project.top.dto.UserRegistrationDto;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

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

    @Override
    public UserDto getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("등록되지 않는 사용자입니다."));

        return new UserDto(user.getId(), user.getLoginId(),
                null, user.getEmail(), user.getPhoneNumber(), user.getNickname());

    }

    @Transactional
    @Override
    public void updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("등록된 사용자가 아닙니다."));
        user.setNickname(userDto.getNickname());
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

    }

    @Transactional
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("등록되지 않은 사용자입니다.");
        }
        userRepository.deleteById(id);
    }
}
