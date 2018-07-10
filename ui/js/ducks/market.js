//Actions
const CHANGE_MARKET = 'NAVIGATION_CHANGE_MARKET';

//Action Functions
export const changeMarket = (market) => ({
	type: CHANGE_MARKET,
	market: market
});

//Known locales
let locales = {
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
