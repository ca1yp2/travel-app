import * as SQLite from 'expo-sqlite'
let db;

//비동기 db 초기화
export const initDB = async () => {
    db = await SQLite.openDatabaseAsync('favorites.db');

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (
           contentid TEXT PRIMARY KEY NOT NULL,
           title TEXT,
           image TEXT,
           address TEXT,
           tel TEXT,
           lat TEXT,
           lon TEXT,
           memo TEXT,
           imageUri TEXT
        );    
    `);
};

//찜 누르면 등록
export const addFavorite = async (item) => {
    if (!db) throw new Error('아지 db가 초기화 되지 않았습니다.');
    await db.runAsync(
        `INSERT OR REPLACE INTO favorites 
        (contentid, title, image, address, tel, lat, lon, memo, imageUri)
        VALUES
        (?,?,?,?,?,?,?,?,?)`,
        [
            item.contentid,
            item.title,
            item.address,
            item.image,
            item.tel,
            item.lat,
            item.lon,
            item.memo || '',
            item.imageUri || ''
        ]
    );
};


//찜 삭제
export const removeFavorite = async (contentid) => {
    await db.runAsync(`DELETE FROM favorites WHERE contentid = ?`, [contentid]);
}

//찜 목록 조회
export const getAllFavorites = async () => {
    const result = await db.getAllAsync(`SELECT * FROM favorites order by contentid desc`);
    return result;
}

//해당 페이지 조회
export const getFavoriteById = async (contentid) => {
    const result = await db.getFirstAsync(`SELECT * FROM favorites WHERE contentid = ?`, [contentid]);
    return result;
}

//찜 여부를 확인
export const isFavorite = async (id) => {
    const result = await db.getFirstAsync(`SELECT * FROM favorites WHERE contentid=?`, [id]);
    return !!result;
}

//메모 삭제
export const clearMemo = async (contentid) => {
    await db.runAsync(
        `UPDATE favorites SET memo = '' WHERE contentid = ?`,
        [contentid]
    );
};

//메모 수정
export const updateMemo = async (contentid, memo) => {
    await db.runAsync(
        `UPDATE favorites SET memo = ? WHERE contentid = ?`,
        [memo, contentid]
    );
};
