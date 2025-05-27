import React, { useState, useRef } from 'react'; // useRef 추가
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native'; // Platform 추가
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants'; // Constants 사용

const KakaoMap = ({ lat, lon }) => {
    const [loading, setLoading] = useState(true);
    // process.env 대신 Constants.expoConfig.extra를 통해 접근하는 것이 Expo에서 권장됩니다.
    // app.json 또는 app.config.js에 "extra" 필드를 통해 API 키를 설정해야 합니다.
    const kakaoApiKey = Constants.expoConfig.extra?.kakaoApiKey; // 여기에 카카오 API 키를 추가

    const webViewRef = useRef(null); // WebView 참조를 위한 ref

    // WebView 내부에서 발생한 메시지를 처리
    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'log') {
                console.log('WebView Log:', data.message);
            } else if (data.type === 'error') {
                console.error('WebView Error:', data.message);
            }
        } catch (error) {
            console.error('Failed to parse message from WebView:', event.nativeEvent.data, error);
        }
    };

    // 로딩 완료 후 (onLoadEnd) 지도가 제대로 표시되지 않는 경우를 대비한 setTimeout
    // 카카오맵 SDK 로딩 및 지도 렌더링에 시간이 걸릴 수 있습니다.
    const handleLoadEnd = () => {
        setTimeout(() => {
            setLoading(false);
        }, 1500); // 1.5초 정도 대기 후 로딩 인디케이터 숨김
    };

    // 로드할 HTML
    const mapHtml = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 100%;
                    overflow: hidden; /* 스크롤바 제거 */
                }
                #map {
                    width: 100%;
                    height: 100%;
                }
            </style>
            <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false"></script>
            <title>Travel map</title>
        </head>
        <body>
            <div id="map"></div>
 
<script>
  function sendLog(msg) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: msg }));
  }
  function sendError(msg) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: msg }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.kakao && kakao.maps && kakao.maps.load) {
      kakao.maps.load(function () {
        try {
          sendLog('Kakao maps SDK loaded');
          var map = new kakao.maps.Map(document.getElementById('map'), {
            center: new kakao.maps.LatLng(${lat}, ${lon}),
            level: 4
          });
          var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(${lat}, ${lon}),
            map: map
          });
        } catch (e) {
          sendError('Map setup error: ' + e.message);
        }
      });
    } else {
      sendError('Kakao SDK not loaded');
    }
  });
</script>
        </body>
        </html>
    `;

    // `kakaoApiKey`가 없으면 경고 메시지 표시 (개발 중 도움)
    if (!kakaoApiKey) {
        return (
            <View style={styles.mapContainer}>
                <Text style={styles.errorText}>카카오 API 키가 설정되지 않았습니다.</Text>
            </View>
        );
    }

    return (
        <View style={styles.mapContainer}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007AEF" />
                    <Text style={styles.loadingText}>지도를 불러오는 중...</Text>
                </View>
            )}
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: mapHtml }}
                style={styles.webview}
                onLoadEnd={handleLoadEnd}
                onMessage={onMessage}
                javaScriptEnabled={true} //javascript 활성화
                domStorageEnabled={true} //dov저장 활성화
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                mixedContentMode={'always'} //http, https 혼합
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 20,
        position: 'relative'
    },
    webview: {
        flex: 1
    },
    loadingOverlay: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 12,
        fontSize: 20,
        color: 'red'
    }
})

export default KakaoMap