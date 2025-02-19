INSERT INTO category (name, description)
SELECT '일반글', '일반적인 내용의 글'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = '일반글');

INSERT INTO category (name, description)
SELECT '모집글', '인원을 모집하는 글(프로젝트, 스터디, 대회, 토론 등)'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = '모집글');

INSERT INTO category (name, description)
SELECT '공지글', '관리자의 공지글'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = '공지글');

INSERT INTO category (name, description)
SELECT '상담글', '상담을 원하는 사용자의 글'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = '상담글');

INSERT INTO category (name, description)
SELECT '판매글', '중고책, 전자장비 등을 판매하는 글'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE name = '판매글');