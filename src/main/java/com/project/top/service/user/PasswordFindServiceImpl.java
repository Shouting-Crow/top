package com.project.top.service.user;

import com.project.top.domain.User;
import com.project.top.dto.user.EmailAndLoginIdCheckDto;
import com.project.top.dto.user.EmailAndLoginIdVerificationDto;
import com.project.top.repository.UserRepository;
import com.project.top.service.email.EmailSenderService;
import com.project.top.verification.EmailVerificationStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordFindServiceImpl implements PasswordFindService {

    private final UserRepository userRepository;
    private final EmailVerificationStorage verificationStorage;
    private final EmailSenderService emailSenderService;

    @Override
    public void checkLoginIdAndSendCode(EmailAndLoginIdCheckDto dto) {
        User user = userRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디 입니다."));

        if (!user.getEmail().equals(dto.getEmail())) {
            throw new IllegalArgumentException("입력한 이메일이 등록된 이메일과 다릅니다.");
        }

        String code = generateVerificationCode();
        verificationStorage.saveCode(dto.getEmail(), code);
        
        emailSenderService.sendEmail(
                dto.getEmail(),
                "비밀전호 찾기 인증 코드",
                "인증 코드: " + code
        );
    }

    @Override
    public boolean verifyCodeAndLoginId(EmailAndLoginIdVerificationDto dto) {
        if (!verificationStorage.verifyCode(dto.getEmail(), dto.getCode())) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        userRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("해당 아이디가 존재하지 않습니다."));

        return true;
    }

    private String generateVerificationCode() {
        int code = (int) (Math.random() * 9000) + 1000;
        return String.valueOf(code);
    }
}
