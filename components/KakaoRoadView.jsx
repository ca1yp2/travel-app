import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const KakaoRoadView = ({ lat, lon }) => {
    const [loading, setLoading] = useState(true);
    const kakaoApiKey = Constants.expoConfig?.extra?.kakaoApiKey;
    const webViewRef = useRef(null);

    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'log') {
                console.log('[WebView]', data.message);
            } else if (data.type === 'error') {
                console.error('[WebView Error]', data.message);
            }
        } catch (e) {
            console.error('Message parse error:', e);
        }
    };

    const handleLoadEnd = () => {
        setTimeout(() => setLoading(false), 1200);
    };

    const mapHtml = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        html, body, #roadview {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        }
    </style>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services"></script>
    </head>
    <body>
    <div id="roadview"></div>
    <script>
        function sendLog(msg) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: msg }));
        }

        function sendError(msg) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: msg }));
        }

        window.onload = function () {
        if (!window.kakao || !kakao.maps || !kakao.maps.load) {
            sendError("Kakao SDK 로딩 실패 또는 load 함수 없음");
            return;
        }

        kakao.maps.load(function () {
            try {
            const container = document.getElementById('roadview');
            const roadview = new kakao.maps.Roadview(container);
            const roadviewClient = new kakao.maps.RoadviewClient();
            const position = new kakao.maps.LatLng(${lat}, ${lon});

            roadviewClient.getNearestPanoId(position, 50, function(panoId) {
                if (panoId) {
                roadview.setPanoId(panoId, position);
                sendLog("로드뷰 로딩 성공");
                } else {
                container.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100%;color:#555;'>해당 위치에 로드뷰가 없습니다.</div>";
                sendError("로드뷰 없음");
                }
            });
            } catch (e) {
            sendError("로드뷰 초기화 실패: " + e.message);
            }
        });
        };
    </script>
    </body>
    </html>
    `;


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
                    <Text style={styles.loadingText}>로드뷰를 불러오는 중...</Text>
                </View>
            )}
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: mapHtml }}
                style={styles.webview}
                onLoadEnd={handleLoadEnd}
                onMessage={onMessage}
                javaScriptEnabled
                domStorageEnabled
                allowFileAccess
                allowUniversalAccessFromFileURLs
                mixedContentMode="always"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 20,
        position: 'relative',
    },
    webview: {
        flex: 1,
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
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
});

export default KakaoRoadView;
