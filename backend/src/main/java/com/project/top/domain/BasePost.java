package com.project.top.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type")
@Getter
@Setter
public abstract class BasePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "basePost", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();

    @Column(nullable = false)
    private int views = 0;

    @Column(nullable = false)
    private int currentMembers = 1;

    @Column(nullable = false)
    private int totalMembers;

    @OneToOne(mappedBy = "basePost", cascade = CascadeType.ALL, orphanRemoval = true)
    private Group group;

    @Column(nullable = false)
    private boolean isInactive;

    @Column(nullable = false)
    private LocalDateTime createdDateTime;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private boolean hasGroup = false;

    public void incrementViews() {
        this.views++;
    }

    public void setDueDate(LocalDate dueDate) {
        if (dueDate.isBefore(createdDateTime.toLocalDate())){
            throw new IllegalArgumentException("마감일은 생성일 이후로 설정해야 합니다.");
        }
        this.dueDate = dueDate;
    }

    public void incrementCurrentMembers() {
        if (currentMembers < totalMembers) {
            this.currentMembers++;
        } else {
            throw new IllegalStateException("모집 인원이 초과되었습니다.");
        }
    }

    public void decrementCurrentMembers() {
        if (currentMembers > 1) {
            this.currentMembers--;
        } else {
            throw new IllegalStateException("모집 등록자는 전체 맴버에 포함되어야 합니다.");
        }
    }

    public void inactivePost() {
        this.isInactive = true;
    }
}
