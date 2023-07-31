import axios from 'axios';
import {getURL} from "../utils/otherUsefullFunctions";

const REST_URL = getURL();
export default class YearPlanAPI {
    static async getAll(year, mosId) {
        const response = await axios.get(REST_URL + "/year_plans", {
            params: {
                year: year,
                mosId: mosId
            }
        });
        return response
    }

    static async create(yearPlan, mosId, username, password) {
        const response = await axios.post(REST_URL + "/year_plans", yearPlan, {
            params: {
                mosId: mosId
            },
            auth: {
                username: username, password: password
            }
        });
        return response
    }

    static async update(yearPlan, mosId, username, password) {
        const response = await axios.put(REST_URL + "/year_plans", yearPlan, {
            params: {
                mosId: mosId
            },
            auth: {
                username: username, password: password
            }
        });
        return response
    }

    static async delete(yearPlan, username, password) {
        const response = await axios.delete(REST_URL + "/year_plans", {
            params: {
                yearPlanId: yearPlan.Id
            },
            auth: {
                username: username, password: password
            }
        });
        return response
    }
}