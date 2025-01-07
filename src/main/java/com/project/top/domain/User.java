package com.project.top.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String nickname;

    private String role = "ROLE_USER";

    public User(String loginId, String password, String email, String phoneNumber, String nickname) {
        this.loginId = loginId;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.nickname = nickname;
    }

    protected User() {}

}
