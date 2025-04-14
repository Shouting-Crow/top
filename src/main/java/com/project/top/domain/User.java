package com.project.top.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    @Column(unique = true, nullable = false)
    private String nickname;

    private String role = "ROLE_USER";

    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reply> replies = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserInfo userInfo;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Recruitment> recruitments = new ArrayList<>();

    @OneToMany(mappedBy = "applicant", cascade = CascadeType.REMOVE)
    private List<Application> applications = new ArrayList<>();

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyGroup> studyGroups = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<GroupMember> groupMembers = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Message> receivedMessages = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ChatMessage> sentChatMessages = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ChatRoomReadLog> chatRoomReadLogs = new ArrayList<>();

    public User(String loginId, String password, String email, String phoneNumber, String nickname) {
        this.loginId = loginId;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.nickname = nickname;
    }

    public User() {}

}
