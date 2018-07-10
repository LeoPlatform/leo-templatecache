import {
	combineReducers
} from 'redux';

import {
	reducer as version
} from "../ducks/versions.js";
import {
	reducer as market
} from "../ducks/market.js";

export default combineReducers({
	version,
	market
});
