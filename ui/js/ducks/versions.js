//Actions
const FETCH_SUCCESS = 'VERSIONS_FETCH_SUCCESS';

const PICK_VERSION_BEGIN = 'VERSIONS_PICK_VERSION_BEGIN';
const PICK_VERSION_SUCCESS = 'VERSIONS_PICK_VERSION';

const PICK_TEMPLATE_BEGIN = 'VERSIONS_PICK_TEMPLATE_BEGIN';
const PICK_TEMPLATE_SUCCESS = 'VERSIONS_PICK_TEMPLATE';

const FETCH_TEMPLATES = 'VERSIONS_FETCH_TEMPLATES';

const CHANGE_TEMPLATE_OPTIONS = 'VERSIONS_CHANGE_TEMPLATE_OPTIONS';

//Action Functions
export const watch = () => {
	return dispatch =>
		$.get(`api/version`, response => {
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
		$.get(`api/version/${v.id}`, response => {
			console.log(response);
			dispatch({
				type: PICK_VERSION_SUCCESS,
				data: response
			});
		});
	};
};
export const changeTemplate = (v, t, options) => {
	return dispatch => {
		dispatch({
			type: PICK_TEMPLATE_BEGIN,
			template: t,
			options: options
		});
		console.log(options);
		$.get(`api/templateVersion/${v.id}/${t.id}`, options, response => {
			dispatch({
				type: PICK_TEMPLATE_SUCCESS,
				data: response
			});
		});
	};
};

//Reducer
export function reducer(state = {
	list: [],
	templates: [],
	templateOptions: {
		showWrapper: 'checked',
		locale: 'en_US',
		auth: 'anonymous'
	},
	version: {
		id: null
	},
	template: {
		id: null
	},
	templateHTML: ''
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
	case PICK_TEMPLATE_BEGIN:
		console.log(state);
		return Object.assign({}, state, {
			template: action.template,
			templateOptions: action.options,
			templateHTML: 'Please wait...Loading'
		});
		break;
	case PICK_TEMPLATE_SUCCESS:
		return Object.assign({}, state, {
			templateHTML: action.data
		});
		break;
	default:
		return state;
	}
}
