import axios from "axios";
import Constants from 'expo-constants'
const SERVICE_KEY = Constants.expoConfig.extra?.tourApiKey;
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2'

const commonParams= {
                    numOfRows: 12,
                    pageNo: 1,
                    MobileOS: 'ETC',
                    MobileApp: 'My Travels',
                    _type: 'json',
                    serviceKey: SERVICE_KEY
                }
export const fetchAreaTourList = async (areaCode = 1, pageNo = 1, contentTypeId = 12) => {
    const response = await axios.get(`${BASE_URL}/areaBasedList2`, {
        params: {
            ...commonParams,
            areaCode,
            pageNo,
            numOfRows: 10,
            contentTypeId
        }
    });
    return response.data?.response?.body?.items?.item || [];
}