#  🧳 TRAVEL APP
TravelApp은 React Native와 Expo를 사용하여 개발한 여행 정보 모바일 애플리케이션입니다.
지역별 여행지 조회, 즐겨찾기 관리, 상세 여행지 정보 보기 등 여행에 유용한 기능들을 제공합니다.

---

## 🛠 개발 언어 및 주요 기능

- 개발 언어: React Native
- 주요 기능:
  - 지역 및 연관 관광지 목록 조회 (공공데이터 포털 API 활용)
  - 여행지 상세 정보 보기
  - Kakao Map 지도 연동 (Kakao 지도 API, WebView 사용 예정)
  - 찜 기능 (SQLite 기반 휴대폰 DB 이용)
  - 메모 기능 (특정 관광지에 사용자 작성 메모 저장, SQLite 사용)
  
---

## 📁 프로젝트 구조

```
TravelApp
├── api                  # API 호출 관련 함수들 (예: tourApi.js, favoriteDB.js 등)
├── assets               # 이미지 및 아이콘 파일
├── components           # 공통 컴포넌트 (AreaSelectModal, HeroHeader, ContentIdTab 등)
├── screens              # 화면 단위 컴포넌트 (HomeScreen, DetailScreen, FavoritesScreen 등)
├── expo                 # Expo 설정 파일 (devices.json 등)
├── app.config.js        # Expo 앱 설정
├── App.js               # 앱 진입점
├── package.json         # 패키지 및 스크립트 정보
└── README.md            # 프로젝트 설명서 (현재 파일)
```

---

## 🚀 실행 방법

### 사전 준비

- Node.js 설치 (권장 버전: 18 이상)
- Expo CLI 설치

```bash
npm install -g expo-cli
```

### 설치 및 실행

- 프로젝트 의존성 설치

```bash
npm install
```

- Expo 개발 서버 실행

```bash
npm start
```

- Android 플랫폼으로 앱 실행

```bash
npm run android
```

---

## ⚙️ 주요 라이브러리

| 라이브러리                      | 설명                             |
|--------------------------------|--------------------------------|
| `react-native`                 | 모바일 앱 UI 프레임워크          |
| `expo`                        | React Native 개발 환경          |
| `@react-navigation/native`    | 화면 간 내비게이션 관리         |
| `axios`                       | API 요청 처리                   |
| `react-native-vector-icons`   | 아이콘 사용                    |
| `react-native-webview`        | 웹뷰 내장                      |
| `react-native-toast-message`  | 토스트 메시지 표시              |
| `expo-image-picker`           | 이미지 선택 기능                |
| `expo-sqlite`                 | SQLite 데이터베이스             |
| `react-native-animated-hamburger` | 애니메이션 햄버거 메뉴 컴포넌트 |

---

## 📄 주요 컴포넌트 및 화면

- HomeScreen.jsx
  - 여행지 목록 조회, 검색, 즐겨찾기 추가/삭제 기능 포함

- DetailScreen.jsx
  - 여행지 상세 정보 표시

- FavoriteScreen.jsx
  - 즐겨찾기 리스트 관리

- AreaSelectModal.jsx
  - 지역 선택 모달 컴포넌트

- HeroHeader.jsx
  - 화면 상단 헤더

- ContentIdTab.jsx
  - 콘텐츠 탭 UI 구성

---

## 📝 참고사항

- React Native 0.79.2, Expo SDK 53.0.9 버전을 사용합니다.
- 환경변수 설정은 .env 파일에서 관리하며, dotenv 라이브러리를 활용합니다.
- 카카오 맵 SDK가 웹뷰 내에서 정상 작동하는 것을 확인하였습니다.

---

## 📚 참고 링크

- [React Native 공식 문서](https://reactnative.dev/docs/getting-started)
- [Expo 공식 문서](https://docs.expo.dev/)
- [React Navigation 공식 문서](https://reactnavigation.org/docs/getting-started)

---

## 📄 라이선스

MIT 라이선스 (MIT License)

저작권 (c) 2025 ca1yp2

본 프로젝트는 학습 및 개인 포트폴리오 용도로 제작되었습니다. 본 소프트웨어 및 관련 문서 파일(이하 "소프트웨어")을 무상으로 획득한 모든 사람에게 소프트웨어를 제한 없이 사용, 복사, 수정, 병합, 출판, 배포, 서브라이선스 및 판매할 권리를 허가합니다.

단, 위 저작권 표시와 이 허가 표시를 소프트웨어의 모든 복사본 또는 중요한 부분에 포함시켜야 합니다.

본 소프트웨어는 상품성, 특정 목적 적합성 및 비침해에 대한 보증 없이 "있는 그대로" 제공됩니다. 저작권자 또는 저작권 보유자는 소프트웨어 사용 또는 기타 거래와 관련하여 발생하는 어떠한 청구, 손해 또는 기타 책임에 대해서도 책임을 지지 않습니다.

---

MIT License

Copyright (c) 2025 ca1yp2

This project was created for learning and personal portfolio purposes. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.