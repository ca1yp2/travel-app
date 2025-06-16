import 'dotenv/config';

export default {
  expo: {
    name: 'TravelApp',
    slug: 'TravelApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/logo.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    extra: {
      kakaoApiKey: process.env.KAKAO_API_KEY,
      tourApiKey: process.env.TOUR_API_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    },
    splash: {
      image: './assets/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/logo.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true,
      permissions: [
        'android.permission.RECORD_AUDIO'
      ],
      package: 'com.ca1yp2.TravelApp'
    },
    web: {
      favicon: './assets/logo.png'
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: '휴대폰 카메라 또는 갤러리 접근 권한이 필요합니다.'
        }
      ],
      [
        'expo-sqlite',
        {
          enableFTS: true,
          useSQLCipher: true,
          android: {
            enableFTS: false,
            useSQLCipher: false
          },
          ios: {
            customBuildFlags: [
              '-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1'
            ]
          }
        }
      ]
    ]
  }
};
