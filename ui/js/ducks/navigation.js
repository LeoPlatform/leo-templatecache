//Actions
const CHANGE_PAGE = 'NAVIGATION_CHANGE_PAGE';

//Action Functions
export const changePage = (page) => ({
	type: CHANGE_PAGE,
	page: page
});

//Reducer
export function reducer(state = {
	page: "versions"
}, action) {
	switch (action.type) {
	case CHANGE_PAGE:
		return Object.assign({}, state, {
			page: action.page
		});
		break;

	default:
		return state;
	}
}
