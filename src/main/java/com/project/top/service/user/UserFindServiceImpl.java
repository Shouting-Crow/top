package com.project.top.service.user;

import com.project.top.domain.User;
import com.project.top.dto.user.EmailVerificationDto;
import com.project.top.dto.user.MaskedLoginIdDto;
import com.project.top.repository.UserRepository;
import com.project.top.service.email.EmailSenderService;
import com.project.top.verification.EmailVerificationStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserFindServiceImpl implements UserFindService {

    private final UserRepository userRepository;
    private final EmailVerificationStorage verificationStorage;
    private final EmailSenderService emailSenderService;

    @Override
    public void sendVerificationCode(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("해당 이메일로 가입한 이력이 없습니다.");
        }

        String code = generateVerificationCode();
        verificationStorage.saveCode(email, code);

        emailSenderService.sendEmail(
                email,
                "아이디 찾기 인증 코드",
                "인증 코드 : " + code
        );
    }

    @Override
    public List<MaskedLoginIdDto> verifyCodeForFindingLoginIds(EmailVerificationDto dto) {
        if (!verificationStorage.verifyCode(dto.getEmail(), dto.getCode())) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        List<User> users = userRepository.findByEmail(dto.getEmail());

        return users.stream()
                .map(user -> new MaskedLoginIdDto(user.getLoginId()))
                .collect(Collectors.toList());
    }

    private String generateVerificationCode() {
        int code = (int) (Math.random() * 9000) + 1000;
        return String.valueOf(code);
    }
}
