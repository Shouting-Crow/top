# 🖥️TOP (토이 프로젝트 모집 사이트)

📆 1차 제작 기간 : 2025.01 ~ 2024.04  
😶 제작자 : 윤진욱 (Shouting Crow)


# 🧩 프로젝트 소개  

자신만의 프로젝트를 발전시키거나 다른 사람들과 함께 제작하고픈 개발자 지망생을 위한 웹 프로젝트입니다. </br>
단지 프로젝트 모집을 위한 공고를 제공하는 것이 아니라 공고를 보고 신청한 사용자들과 함께 그룹을 만들고 정보를 공유할 수 있는 그룹 페이지와 채팅 및 쪽지 기능도 제공합니다. </br>
또한 스터디 그룹 모집도 제공을 하여 프로젝트를 하기는 부담스러운 사용자들은 다른 사용자들과 함께 학습을 진행할 수 있습니다. </br>
게시판도 지원을 하여 모집을 하거나 질문 등을 올려서 건전한 커뮤니티를 이뤄나갈 수도 있습니다. </br>

# 🔍 주요 기능
### 프로젝트 및 스터디그룹 모집 공고
* 누구나 모집 공고 등록이 가능
* 누구나 공고를 확인하고 원하는 공고에 지원 가능
* 공고 등록자는 지원자의 정보를 확인하고 승인/거부를 하여 그룹을 꾸릴 수 있음
### 쪽지 기능
* 공고 등록자나 다른 사용자에게 쪽지를 보낼 수 있음
* 최근 다섯 개의 쪽지를 확인할 수 있는 메뉴를 제공
* 쪽지함에서 확인 및 쪽지 삭제가 가능
### 그룹 생성 및 관리
* 공고 등록자는 공고를 마감하고 그룹을 생성할 수 있음
* 그룹원들은 자신들의 그룹 페이지에서 원하는 활동이 가능함
### 채팅 기능
* 그룹 관리자는 자신의 그룹의 채팅방을 생성할 수 있음
* 채팅방은 실시간 통신이 가능하도록 설계
### 게시판
* 누구나 게시글을 등록할 수 있음
* 게시글의 댓글을 이용할 수 있음
### 회원가입 및 로그인
* JWT 기능을 이용한 로그인 유지로 안정성을 올림


# 🔧 개발 환경
### 백엔드
* Java
* Spring Boot
* MySQL
* JPA 
* QueryDSL
* WebSocket
* Spring Security
* Gradle
### 프론트엔드
* React
* Javascript
* HTML
* TailwindCSS

# 📝 다이어그램
![top_diagram drawio](https://github.com/user-attachments/assets/2ffa2c77-7197-44cd-9daf-19efdffbb1ce)


# 📁 파일 구조
```
├─ backend
│  ├─ java
│  │  └─ com
│  │      └─ project
│  │          └─ top
│  │              ├─ batch
│  │              ├─ config
│  │              ├─ controller
│  │              ├─ domain
│  │              ├─ dto
│  │              │  ├─ application
│  │              │  ├─ basePost
│  │              │  ├─ board
│  │              │  ├─ category
│  │              │  ├─ chatMessage
│  │              │  ├─ chatRoom
│  │              │  ├─ group
│  │              │  ├─ groupMember
│  │              │  ├─ login
│  │              │  ├─ message
│  │              │  ├─ recruitment
│  │              │  ├─ reply
│  │              │  ├─ studyGroup
│  │              │  ├─ user
│  │              │  └─ userInfo
│  │              ├─ filter
│  │              ├─ initializer
│  │              ├─ interceptor
│  │              ├─ repository
│  │              ├─ security
│  │              ├─ service
│  │              │  ├─ application
│  │              │  ├─ basePost
│  │              │  ├─ board
│  │              │  ├─ chat
│  │              │  ├─ group
│  │              │  ├─ groupMember
│  │              │  ├─ login
│  │              │  ├─ message
│  │              │  ├─ recruitment
│  │              │  ├─ reply
│  │              │  ├─ studyGroup
│  │              │  ├─ user
│  │              │  ├─ userInfo
│  │              │  └─ util
│  │              └─ util
│  └─ resources
│      └─ static
│          └─ js
│
└─ frontend
   ├─ assets
   ├─ components
   ├─ context
   └─ pages
```


