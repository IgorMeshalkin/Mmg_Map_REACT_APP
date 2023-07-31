import axios from 'axios';
import {getURL} from "../utils/otherUsefullFunctions";

const REST_URL = getURL();
export default class MoAPI {
    static async getAll() {
        const response = await axios.get(REST_URL + "/mos");
        return response
    }

    static async getByUserId(userId) {
        const response = await axios.get(REST_URL + "/mos/by_user", {
            params: {
                userId: userId
            }
        });
        return response
    }

    static async create(mo, username, password) {
        const response = await axios.post(REST_URL + "/mos", mo, {
            auth: {
                username: username, password: password
            }
        })
        return response
    }

    static async update(mo, username, password) {
        const response = await axios.put(REST_URL + "/mos", mo, {
            auth: {
                username: username, password: password
            }
        })
        return response
    }
}