import React, { useRef, useState, useEffect } from 'react'
import {
    Modal,
    Animated,
    Easing,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { areaCodes } from '../api/regions'

const screenWidth = Dimensions.get('window').width;

const AreaSelectModal = ({ visible, onClose, onSelect }) => {
    const slideAnim = useRef(new Animated.Value(screenWidth)).current;
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.timing(slideAnim, {
                toValue: screenWidth * 0.6,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: screenWidth,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: false
            }).start(() => {
                setShowModal(false);
            });
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: screenWidth,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false
        }).start(() => {
            setShowModal(false);
            onClose();
        });
    }

    if (!showModal) return null;

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={handleClose}>
                <Animated.View style={[styles.sideModal, { left: slideAnim }]}
                    onStartShouldSetResponder={() => true}
                >
                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose} >
                        <Ionicons name="close" size={24} color='#000' />
                    </TouchableOpacity>
                    <Text style={styles.title}>지역선택</Text>
                    {
                        areaCodes.map((area) => (
                            <TouchableOpacity
                                key={area.code}
                                onPress={() => onSelect(area.code)}
                            >
                                <Text style={{ paddingVertical: 10 }}>{area.name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </Animated.View>
            </TouchableOpacity >
        </Modal >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    sideModal: {
        position: 'absolute',
        top: 0,
        width: screenWidth * 0.4,
        height: '100%',
        backgroundColor: '#fff',
        paddingVertical: 60,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    }
})
export default AreaSelectModal