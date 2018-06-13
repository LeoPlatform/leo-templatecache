//Actions
const FETCH_SUCCESS = 'VERSIONS_FETCH_SUCCESS';

//Action Functions
export const watch = () => {
	return dispatch =>
		$.get(`api/version`).promise()
		.then(response => {
			console.log("response", response);
			dispatch({
				type: FETCH_SUCCESS,
				data: response
			});
			return {}
		});
};

//Reducer
export function reducer(state = {
	list: []
}, action) {
	switch (action.type) {
	case FETCH_SUCCESS:
		return Object.assign({}, state, {
			list: action.data
		});
	default:
		return state;
	}
}
