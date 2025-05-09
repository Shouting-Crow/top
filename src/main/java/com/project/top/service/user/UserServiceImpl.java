package com.project.top.service.user;

import com.project.top.domain.User;
import com.project.top.dto.user.UserDto;
import com.project.top.dto.user.UserRegistrationDto;
import com.project.top.dto.user.UserUpdateDto;
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

    @Override
    public UserDto getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("등록되지 않는 사용자입니다."));

        return new UserDto(user.getId(), user.getLoginId(),
                null, user.getEmail(), user.getPhoneNumber(), user.getNickname());

    }

    @Transactional
    @Override
    public void updateUser(Long id, UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("등록된 사용자가 아닙니다."));
        user.setLoginId(userUpdateDto.getLoginId());
        user.setNickname(userUpdateDto.getNickname());
        user.setEmail(userUpdateDto.getEmail());
        user.setPhoneNumber(userUpdateDto.getPhoneNumber());

        if (userUpdateDto.getPassword() != null && !userUpdateDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
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

    @Override
    public Long getUserIdFromLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당되는 사용자가 없습니다."));

        return user.getId();
    }

    @Override
    public UserDto getUserByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당되는 사용자가 없습니다."));

        return new UserDto(user.getId(), user.getLoginId(),
                null, user.getEmail(), user.getPhoneNumber(), user.getNickname());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void validateLoginIdAndEmail(String loginId, String email) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디 입니다."));

        if (!user.getEmail().equals(email)) {
            throw new IllegalArgumentException("입력한 이메일이 등록된 이메일과 다릅니다.");
        }
    }
}
