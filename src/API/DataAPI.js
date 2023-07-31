import axios from 'axios';
import {getURL} from "../utils/otherUsefullFunctions";

const REST_URL = getURL();
export default class DataAPI {

    static async get(mo, week) {
        const response = await axios.get(REST_URL + "/full_data", {
            params: {
                mosId: mo.Id,
                weekId: week.Id
            }
        });
        return response
    }

    static async save(data, mo, week, username, password) {
        const response = await axios.post(REST_URL + "/data", data,{
            params: {
                mosId: mo.Id,
                weekId: week.Id
            },
            auth: {
                username: username, password: password
            }
        });
        return response
    }
}