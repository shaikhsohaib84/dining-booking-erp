import {ActionTypes} from '../constant/actionType'

export const setGeneric = (object={}) => {
    return {
        type: ActionTypes?.SET_GENERIC,
        payload: object
    }
}