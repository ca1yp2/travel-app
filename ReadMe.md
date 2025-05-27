# TRAVEL APP
## 1. 프로젝트 구성
- 개발언어: React Native
- 기능
  - 지역/연관 관광지 목록: 공공데이터 포털 API
  - 여행지 상세보기
  - Kakao Map 지도 연동: Kakao 지도 api (WebView 사용예정)
  - 찜 기능: SQLite이용 (휴대폰 DB)
  - 메모 기능: 특정 관광지에 직접 작성한 메모 저장 (휴대폰 DB)

## 2. 개발 구조
- travel-app
  - App.js
  - 📂 screens
    - HomeScreen.js ← 관광지 목록
    - DetailScreen.js ← 상세 정보 + KakaoMap + 메모
    - FavoritesScreen.js ← 찜 목록
  - 📂 components
    - PlaceCard.js ← 관광지 미리보기 카드
    - AreaSelectModal.js ← 지역 선택 모달
  - 📂 api
    - tourApi.js ← 공공데이터포털 api
    - regions.js ← 지역 코드
    - contentType.js ← 데이터 분류 코드
  - 📂 db
    - localdb.js ← SQLite 초기화 및 CRUD