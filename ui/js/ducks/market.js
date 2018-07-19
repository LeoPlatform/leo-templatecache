//Actions
const CHANGE_MARKET = 'NAVIGATION_CHANGE_MARKET';
import {
	watch
} from '../ducks/versions.js';

//Action Functions
export const changeMarket = (market) => {
	return dispatch => {
		dispatch(watch(market));
		dispatch({
			type: CHANGE_MARKET,
			market: market
		});
	};
};

//Known locales
let locales = {
	'glbl': ["en_US", "es_US", "en_CA", "fr_CA", "en_AU", "en_NZ", "en_UK", "es_MX", "en_MX", "de_DE", "en_DE", "fr_FR", "en_FR", "es_ES", "en_ES", "zh_HK", "en_HK", "it_IT", "en_IT", "en_IE"],
	"us": ["en_US", "es_US"],
	"ca": ["en_CA", "fr_CA"],
	"au": ["en_AU"],
	"nz": ["en_NZ"],
	"uk": ["en_UK"],
	"mx": ["es_MX", "en_MX"],
	"de": ["de_DE", "en_DE"],
	"fr": ["fr_FR", "en_FR"],
	"es": ["es_ES", "en_ES"],
	"hk": ["zh_HK", "en_HK"],
	"it": ["it_IT", "en_IT"],
	"ie": ["en_IE"]
};

//Reducer
export function reducer(state = {
	id: "US",
	languages: locales['us']
}, action) {
	switch (action.type) {
	case CHANGE_MARKET:
		return Object.assign({}, state, {
			id: action.market,
			languages: locales[action.market.toLowerCase()]
		});
		break;

	default:
		return state;
	}
}
