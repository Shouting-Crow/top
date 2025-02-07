package com.project.top.repository;

import com.project.top.domain.GroupMember;
import com.project.top.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByMember(User member);
    Optional<GroupMember> findByGroupIdAndMemberId(Long groupId, Long memberId);

    @Modifying
    @Query("delete from GroupMember gm where gm.group.id = :groupId " +
            "and gm.member.id = :memberId")
    void removeMemberFromGroup(@Param("groupId") Long groupId, @Param("memberId") Long memberId);

    boolean existsByGroupIdAndMemberId(Long groupId, Long memberId);
    long countByGroupId(Long groupId);
}
