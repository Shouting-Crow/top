package com.project.top.repository;

import com.project.top.domain.GroupMember;
import com.project.top.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByMember(User member);
}
