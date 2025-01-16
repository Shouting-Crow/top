package com.project.top.repository;

import com.project.top.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupRepository extends JpaRepository<Group, Long> {
//
//    @Modifying
//    @Query("DELETE FROM Group g WHERE g.id = :groupId")
//    void deleteGroupById(@Param("groupId") Long groupId);
}
