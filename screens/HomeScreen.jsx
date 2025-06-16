import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    TextInput,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Toast from 'react-native-toast-message';
import { fetchAreaTourList } from '../api/tourApi';
import { addFavorite, isFavorite, removeFavorite, getAllFavorites } from '../api/favoriteDB';
import Hamburger from 'react-native-animated-hamburger';
import AreaSelectModal from '../components/AreaSelectModal';
import HeroHeader from '../components/HeroHeader';
import ContentIdTab from '../components/ContentIdTab';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
    const [areaCode, setAreaCode] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [hamburgerActive, setHamburgerActive] = useState(false);
    const [places, setPlaces] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [contentTypeId, setContentTypeId] = useState(12);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [favorites, setFavorites] = useState({});
    const toastShow = useRef(false);
    const nav = useNavigation();

    const showToast = (message) => {
        Toast.show({
            type: 'info',
            text1: message,
            position: 'bottom',
            visibilityTime: 1500
        });
    };

    const updateFavs = async (items) => {
        const favMap = {};
        const seen = new Set();
        for (const item of items) {
            if (!seen.has(item.contentid)) {
                const fav = await isFavorite(item.contentid);
                favMap[item.contentid] = fav;
                seen.add(item.contentid);
            }
        }
        setFavorites((prev) => ({ ...prev, ...favMap }));
    };

    const toggleFavorite = async (item) => {
        const contentid = item.contentid;
        const isFav = favorites[contentid];

        if (isFav) {
            await removeFavorite(contentid);
        } else {
            await addFavorite({
                contentid,
                title: item.title,
                image: item.firstimage || require('../assets/no-background.jpg'),
                address: item.addr1,
                tel: item.tel,
                lat: item.mapy,
                lon: item.mapx,
                memo: '',
                imageUri: ''
            });
        }

        setFavorites(prev => ({
            ...prev,
            [contentid]: !isFav
        }));
    }

    const loadMoreData = async (reset = false) => {
        if (loading || (!hasMore && !reset)) {
            // if (!toastShow.current && !reset) {
            //     showToast('마지막 페이지입니다.');
            //     toastShow.current = true;
            // }
            return;
        }
        setLoading(true);
        try {
            const page = reset ? 1 : pageNo;
            const newData = await fetchAreaTourList(areaCode, page, contentTypeId);

            const filtered = newData.filter(item =>
                item.title?.includes(keyword) || item.addr1?.includes(keyword)
            );
            if (reset) {
                setPlaces(filtered);
                setPageNo(2);
                setHasMore(filtered.length > 0);
                toastShow.current = false;
                await updateFavs(filtered);
            } else {
                setPlaces(prev => {
                    const combined =[...prev, ...filtered];
                    return combined;
            });
                setPageNo(prev => prev + 1);
                await updateFavs(filtered);
                if (filtered.length === 0) {
                    setHasMore(false);
                    if (!toastShow.current) {
                        showToast('마지막 페이지입니다.');
                        toastShow.current = true;
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMoreData(true);
    }, [areaCode, , contentTypeId, keyword]);

    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
            const favs = await getAllFavorites();
            // 이거 빠져있으면 안돼요!
            const mapped = {};
            favs.forEach(fav => {
                mapped[fav.contentid] = true;
            });
            setFavorites(mapped);
            };
            loadFavorites();
        }, [])
    );

    const data = ({ item }) => {
        const isFav = favorites[item.contentid];
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => nav.navigate('detail', { item })}
            >
                <ImageBackground
                    source={item.firstimage ? { uri: item.firstimage } : require('../assets/no-background.jpg')}
                    style={styles.image}
                    imageStyle={{ borderRadius: 10 }}
                >
                    <View style={styles.overlay}>
                        <View>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.addr}>{item.addr1 || '주소 정보 없음'}</Text>
                        </View>
                        <MaterialIcons
                            name={isFav ? 'favorite' : 'favorite-outline'}
                            size={30}
                            color={isFav ? 'red' : 'gray'}
                            style={styles.micons}
                            onPress={() => toggleFavorite(item)}
                        />
                    </View>

                </ImageBackground>

            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <HeroHeader />
            <View style={styles.headerBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="검색..."
                    value={keyword}
                    onChangeText={setKeyword}
                />
                <View style={styles.hamburger}>
                    <Hamburger
                        type="cross"
                        underlayColor="transparent"
                        active={hamburgerActive}
                        onPress={() => {
                            setHamburgerActive(!hamburgerActive);
                            setModalVisible(!modalVisible);
                        }}
                    />
                </View>
            </View>
            <ContentIdTab
                selectedId={contentTypeId}
                onSelect={setContentTypeId}
            />
            <AreaSelectModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setHamburgerActive(false);
                }}
                onSelect={(code) => {
                    setAreaCode(code);
                    setModalVisible(false);
                    setHamburgerActive(false);
                }}
            />
            <FlatList
                data={places}
                keyExtractor={(item) => item.contentid.toString()}
                renderItem={data}
                onEndReached={() => loadMoreData()}
                onEndReachedThreshold={0.7}
                ListFooterComponent={
                    loading ? <ActivityIndicator
                        style={{ padding: 16 }}
                        size="large"
                    /> : null
                }
            />
            <Toast />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    headerBar: {
        flexDirection: 'row',
        alignContent: 'center',
        marginHorizontal: 10,
        marginTop: 60,
        marginBottom: 150
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        fontSize: 16
    },
    hamburger: {
        marginLeft: 30
    },
    card: {
        marginBottom: 15
    },
    image: {
        width: screenWidth - 20,
        height: 200,
        justifyContent: 'flex-end'
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        position: 'relative'
    },
    micons: {
        position: 'absolute',
        right: 20,
        top: 15
    },
    title: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold'
    },
    addr: {
        color: '#666',
        fontSize: 14
    }
});

export default HomeScreen