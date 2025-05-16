package com.project.top.initializer;

import com.project.top.domain.Category;
import com.project.top.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryInitializer implements ApplicationRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        createIfNotExists("일반글", "일반적인 내용의 글");
        createIfNotExists("모집글", "인원을 모집하는 글(프로젝트, 스터디, 대회, 토론 등)");
        createIfNotExists("공지글", "관리자의 공지글");
        createIfNotExists("상담글", "상담을 원하는 사용자의 글");
        createIfNotExists("판매글", "중고책, 전자장비 등을 판매하는 글");
    }

    private void createIfNotExists(String name, String description) {
        if (!categoryRepository.existsByName(name)) {
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            categoryRepository.save(category);
        }
    }
}
