import {
	combineReducers
} from 'redux';

import {
	reducer as version
} from "./ducks/versions.js";
export default combineReducers({
	version
});
