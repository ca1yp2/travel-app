import React from 'react'
import { ImageBackground, Text, View, StyleSheet, Image, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
const screenWidth = Dimensions.get('window').width;
const HeroHeader = () => {
    return (
        <ImageBackground
            source={require('../assets/hero.jpg')}
            style={styles.hero}
        >
            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,1)']}
                style={styles.gradient}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    '쉼표'의 미학, 나만쓰는 여행앱
                </Text>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    hero: {
        height: 450,
        position: 'absolute',
        top: 0,
        left: 0,
        width: screenWidth,
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1
    },
    textContainer: {
        position: 'absolute',
        bottom: 285,
        left: 20,
        zIndex: 2
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.8)',  //그림자색
        textShadowOffset: { width: 1, height: 1 }, //그림자위치
        textShadowRadius: 5  //그림자 번짐정도
    }
})
export default HeroHeader