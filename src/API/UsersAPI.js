import axios from 'axios';
import {getURL} from "../utils/otherUsefullFunctions";

const REST_URL = getURL();
export default class UsersAPI {
    static async getAll(username, password) {
        const response = await axios.get(REST_URL + "/users", {
            auth: {
                username: username, password: password
            }
        });
        return response
    }

    static async create(user, username, password) {
        console.log(username)
        console.log(password)
        const response = await axios.post(REST_URL + "/users", user, {
            auth: {
                username: username, password: password
            }
        })
        return response
    }

    static async update(user, username, password) {
        const response = await axios.put(REST_URL + "/users", user, {
            auth: {
                username: username, password: password
            }
        })
        return response
    }

    static async login(username, password) {
        const response = await axios.get(REST_URL + "/users/enter", {
            auth: {
                username: username, password: password
            }
        })
        return response
    }
}