import { ActionTypes } from "../constant/actionType"

export const modelReducer = (state = [], action) => {
    const {formName, type, payload} = action;
    debugger;
    switch(type){
        case ActionTypes?.SET_MODEL: 
            return { ...state, [formName]: [...payload] };
        default: return state
    }
}