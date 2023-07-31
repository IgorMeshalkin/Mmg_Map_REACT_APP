import axios from 'axios';
import {getURL} from "../utils/otherUsefullFunctions";

const REST_URL = getURL();
export default class WeekAPI {

    static async getAll(year) {
        const response = await axios.get(REST_URL + "/weeks", {
            params: {
                year: year
            }
        });
        return response
    }

    static async getYears() {
        const response = await axios.get(REST_URL + "/years");
        return response
    }

    static async create(week, username, password) {
        const response = await axios.post(REST_URL + "/weeks", week, {
            auth: {
                username: username, password: password
            }
        });
        return response
    }

    static async update(week, username, password) {
        const response = await axios.put(REST_URL + "/weeks", week, {
            auth: {
                username: username, password: password
            }
        });
        return response
    }

    static async delete(week, username, password) {
        const response = await axios.delete(REST_URL + "/weeks", {
            params: {
                weekId: week.Id
            },
            auth: {
                username: username, password: password
            }
        });
        return response
    }
}