import { combineReducers } from "redux";
import { genericReducer } from '../reducer/genericReducer'
import { modelReducer } from "./modelReducer";

const reducers = combineReducers({
    models: modelReducer,
    generic: genericReducer
})
export default reducers