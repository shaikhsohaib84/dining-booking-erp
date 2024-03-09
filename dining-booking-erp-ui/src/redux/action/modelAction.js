import {ActionTypes} from '../constant/actionType'

export const setModel = (name='', data=[]) => {
    return {
        formName: name,
        type: ActionTypes?.SET_MODEL,
        payload: data
    }
}