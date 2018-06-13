import {
	combineReducers
} from 'redux';

import {
	reducer as version
} from "./ducks/versions.js";
import {
	reducer as navigation
} from "./ducks/navigation.js";

export default combineReducers({
	version,
	navigation
});
