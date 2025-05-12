package com.project.top.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "user_groups")
public class Group extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupType type;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_post_id", nullable = false)
    private BasePost basePost;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMember> members = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupStatus status;

    @OneToOne(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private ChatRoom chatRoom;

    public void addMember(GroupMember member) {
        members.add(member);
        member.setGroup(this);
    }

    public void removeMember(GroupMember member) {
        members.remove(member);
        member.setGroup(null);
    }

}
