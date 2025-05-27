import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    TouchableOpacity,
    Modal, Alert,
    ScrollView, StyleSheet, Button, Platform
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
//import DropShadow from 'react-native-drop-shadow'
import KakaoMap from '../components/KakaoMap'
import KakaoRoadView from '../components/KakaoRoadView'
import { addFavorite, isFavorite, removeFavorite, getFavoriteById } from '../api/favoriteDB';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as ImagePicker from 'expo-image-picker';

const DetailScreen = ({ route }) => {
    const uroute = useRoute();
    const nav = useNavigation();
    const [isFav, setIsFav] = useState(false);
    const [message, setMessage] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [favData, setFavData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { contentid, contenttypeid, title, firstimage, addr1, tel, mapx, mapy } = route.params.item;
    const icons = {
        12: require('../assets/icon/12.png'),
        14: require('../assets/icon/14.png'),
        15: require('../assets/icon/15.png'),
        25: require('../assets/icon/25.png'),
        28: require('../assets/icon/28.png'),
        32: require('../assets/icon/32.png'),
        38: require('../assets/icon/38.png'),
        39: require('../assets/icon/39.png')
    }

    //갤러리에서 이미지를 선택
    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!permission.granted){
            Alert.alert("권한 필요", "갤러리 접근 권한이 필요함");
            return;
        }
        const result = ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        if(!result.canceled){
            setImageUri(result.assets[0].uri);
        }
    }

    //카메라를 이용해서 사진을 촬영
    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if(!permission.granted){
            Alert.alert("권한 필요", "갤러리 접근 권한이 필요함");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        if(!result.canceled){
            setImageUri(result.assets[0].uri);
        }
    }

    useEffect(() => {
        const load = async () => {
            const fav = await isFavorite(contentid);
            setIsFav(fav);
            const data = await getFavoriteById(contentid);
            setFavData(data);
        };
        load();
    }, []);

    const toggleFavorite = async () => {
        if (isFav) {
            await removeFavorite(contentid);
        } else {
            await addFavorite({
                contentid,
                title,
                image: firstimage || require('../assets/no-background.jpg'),
                address: addr1,
                tel,
                lat: mapy,
                lon: mapx,
                memo: "",
                imageUri: ""
            });
        }
        setIsFav(!isFav);
        const updated = await getFavoriteById(contentid);
        setFavData(updated);
    };

    const saveMemo = async () => {
        await addFavorite({
            contentid,
            title,
            image: firstimage || require('../assets/no-background.jpg'),
            address: addr1,
            tel,
            lat: mapy,
            lon: mapx,
            memo: message,
            imageUri
        });
        setModalVisible(false);
        const updated = await getFavoriteById(contentid);
        setFavData(updated);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground
                source={firstimage ? { uri: firstimage } : require('../assets/no-background.jpg')}
                style={styles.image}
                resizeMode="cover"
            >
                <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
                    <MaterialIcons
                        name={isFav ? 'favorite' : 'favorite-outline'}
                        size={32}
                        color={isFav ? 'red' : 'white'}
                    />
                </TouchableOpacity>
            </ImageBackground>
            <View style={[styles.box, Platform.select({
                ios: styles.isoShadow,
                android: styles.androidShadow
            })]}>
                <View style={styles.titlebox}>
                    <Image source={icons[contenttypeid]} style={styles.icon} />
                    <Text style={styles.title}>
                        {title}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.text}>
                        주소 : {addr1 || '주소정보 없음'}
                    </Text>
                    <Text style={styles.text}>
                        연락처 : {tel || '연락처 정보 없음'}
                    </Text>
                </View>
                <KakaoRoadView lon={mapx} lat={mapy} />
                <KakaoMap lon={mapx} lat={mapy} />

                {/* 내 메모 보이기 */}
                {
                    (favData?.imageUri) && (
                        <Image source={{uri:favData.imageUri}} style={styles.viewImage} />
                    )
                }
                {
                    (favData?.memo) && (
                        <View style={styles.memoSection}>
                            <Text style={styles.memoTitle}>🖋 작성한 메모</Text>
                            {favData.memo ? <Text style={styles.memoText}>
                                {favData.memo}
                            </Text> : null}
                        </View>
                    )
                }

                {/** 메시지 모달 */}
                <Modal visible={modalVisible} animationType='slide'>
                    <View style={styles.modalContainer}>
                        <View>
                            <Text style={styles.modalTitle}>메모 작성</Text>
                        </View>
                        <View>
                            <TextInput
                            multiline
                            placeholder='메모를 작성하세요.'
                            style={styles.textarea}
                            value={message}
                            onChangeText={setMessage}
                            />
                        </View>
                        {imageUri && (
                            <View>
                                <Image source={{uri: imageUri}} style={styles.imagePreview} />
                            </View>
                        )}
                        <View>
                            <View>
                                <Text style={styles.modalTitle}>사진 등록</Text>
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.btn} onPress={pickImage}>
                                    <Text style={styles.btnText}>갤러리에서 선택</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={takePhoto}>
                                    <Text style={styles.btnText}>카메라로 촬영</Text>
                                </TouchableOpacity>
                            </View>
                        </View>   
                        <View style={{marginBottom:10}}> 
                            <Button title="저장" onPress={saveMemo} />
                        </View>
                        <View style={{marginBottom:10}}>
                            <Button title="닫기" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnText}>메모작성</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={toggleFavorite}>
                    <Text style={styles.btnText}>{isFav ? '찜 해제' : '찜하기'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => nav.goBack()}>
                    <Text style={styles.btnText}>BACK</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: 250,
        justifyContent: 'flex-end'
    },
    favoriteIcon: {
        position: 'absolute',
        top: 40,
        right: 20
    },
    titlebox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 20
    },
    icon: {
        height: 25,
        width: 25,
    },
    box: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: '100%',
        padding: 20,
        marginTop: -40,
    },
    isoShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -10
        },
        shadowOpacity: 0.2,
        shadowRadius: 5
    },
    androidShadow: {
        elevation: 5
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 15

    },
    column: {
        flexDirection: 'column'
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15
    },
    textarea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        textAlignVertical: 'top'
    },
    memoSection: {
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        padding: 15
    },
    memoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    memoText: {
        fontSize: 16,
        marginBottom: 10
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#3498db'
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderRadius: 10,
        objectFit: 'cover'
    },
    viewImage: {
        width: '100%',
        height: 250,
        marginBottom: 10,
        borderRadius: 10,
        objectFit: 'cover'
    }
})

export default DetailScreen