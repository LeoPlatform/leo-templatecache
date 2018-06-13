//Actions
const FETCH_SUCCESS = 'VERSIONS_FETCH_SUCCESS';

const PICK_VERSION_BEGIN = 'VERSIONS_PICK_VERSION_BEGIN';
const PICK_VERSION_SUCCESS = 'VERSIONS_PICK_VERSION';

const FETCH_TEMPLATES = 'VERSIONS_FETCH_TEMPLATES';

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
		});
};
export const changeVersion = (v) => {
	return dispatch => {
		dispatch({
			type: PICK_VERSION_BEGIN,
			version: v
		});
		$.get(`api/version/${v.id}`).promise().then(response => {
			console.log(response);
			dispatch({
				type: PICK_VERSION_SUCCESS,
				data: response
			})
		});
	}
};

//Reducer
export function reducer(state = {
	list: [],
	templates: [],
	version: {
		id: null
	}
}, action) {
	switch (action.type) {
	case FETCH_SUCCESS:
		return Object.assign({}, state, {
			list: action.data,
		});
	case PICK_VERSION_BEGIN:
		return Object.assign({}, state, {
			version: action.version,
			templates: []
		});
		break;
	case PICK_VERSION_SUCCESS:
		return Object.assign({}, state, {
			templates: action.data
		});
		break;
	default:
		return state;
	}
}
