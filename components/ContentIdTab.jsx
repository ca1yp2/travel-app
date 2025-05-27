import React from 'react'
import { View, TouchableOpacity, Image, Text, Dimensions, StyleSheet } from 'react-native'
import { contentTypes } from '../api/contentType'

const screenWidth = Dimensions.get('window').width;
const numColumns = 4;
const itemSize = (screenWidth - 50) / numColumns;

const ContentIdTab = ({ selectedId, onSelect }) => {

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

    return (
        <View style={styles.gridContainer}>
            {
                contentTypes.map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        style={styles.gridItem}
                        onPress={() => onSelect(type.id)}
                    >
                        <View style={[styles.iconCase, selectedId === type.id && styles.selectedItem]}>
                            <Image source={icons[type.id]} style={styles.icon} />
                        </View>
                        <Text style={styles.label}>{type.label}</Text>
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}
const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20,
        marginTop: -45,
        marginBottom: 30,

        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5  //안드로이드에서 그림자는 이게 있어야 함
    },
    gridItem: {
        width: itemSize,
        height: itemSize,
        alignItems: 'center',
        marginBottom: 10
    },
    iconbox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '50%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedItem: {
        backgroundColor: '#007aff'
    },
    iconCase: {
        width: 60,
        height: 60,
        backgroundColor: '#ddd',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 35,
        height: 35
    },
    label: {
        fontSize: 13,
        color: "#333"
    }
})
export default ContentIdTab