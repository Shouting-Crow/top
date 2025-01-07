package com.project.top.service;

import com.project.top.domain.User;
import com.project.top.dto.LoginDto;
import com.project.top.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public String login(LoginDto loginDto) {
        Optional<User> userOptional = userRepository.findByLoginId(loginDto.getLoginId());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
                return "로그인 성공";
            } else {
                return "비밀번호가 일치하지 않습니다.";
            }
        } else {
            return "아이디가 존재하지 않습니다.";
        }
    }
}
