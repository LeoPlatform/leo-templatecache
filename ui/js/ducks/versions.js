//Actions
const FETCH_SUCCESS = 'VERSIONS_FETCH_SUCCESS';

const PICK_VERSION_BEGIN = 'VERSIONS_PICK_VERSION_BEGIN';
const PICK_VERSION_SUCCESS = 'VERSIONS_PICK_VERSION';

const PICK_TEMPLATE_BEGIN = 'VERSIONS_PICK_TEMPLATE_BEGIN';
const PICK_TEMPLATE_SUCCESS = 'VERSIONS_PICK_TEMPLATE';
const PICK_TEMPLATE_CHANGED = 'VERSIONS_PICK_CHANGED';

const FETCH_TEMPLATES = 'VERSIONS_FETCH_TEMPLATES';

const CHANGE_TEMPLATE_OPTIONS = 'VERSIONS_CHANGE_TEMPLATE_OPTIONS';
const CHANGE_TEMPLATE_HTML = 'CHANGE_TEMPLATE_HTML';

const ADD_RELEASE = 'VERSIONS_ADD_RELEASE';

const SHOW_DIALOG = 'VERSIONS_SHOW_DIALOG';
const HIDE_DIALOG = 'VERSIONS_HIDE_DIALOG';

const SHOW_CONTENT_DIALOG = 'VERSIONS_SHOW_CONTENT_DIALOG';
const HIDE_CONTENT_DIALOG = 'VERSIONS_HIDE_CONTENT_DIALOG';

const SHOW_IMPORT_DIALOG = 'VERSIONS_SHOW_IMPORT_DIALOG';
const HIDE_IMPORT_DIALOG = 'VERSIONS_HIDE_IMPORT_DIALOG';

//Action Functions
export const watch = () => {
	return dispatch =>
		$.get(`api/version`, response => {
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
			dispatch({
				type: PICK_VERSION_SUCCESS,
				data: response
			});
		});
	};
};
export const createRelease = (timestamp, name) => {
	return dispatch => {
		dispatch({
			type: ADD_RELEASE,
			data: {
				id: name,
				ts: timestamp
			}
		});
		$.post(`api/version`, {
			name,
			timestamp
		}, response => {
			dispatch({
				type: ADD_RELEASE,
				data: response
			});
		});
	}
};

export const initialTemplate = (v, t, market) => {
    return dispatch => {
        dispatch({
            type: PICK_TEMPLATE_BEGIN,
            template: t
        });
        $.get(`api/templateVersion/${v.id}/${t.id}?market=${market}`, response => {
        	// Change checkbox to have this state
        	let checkedBox = false;
        	Object.keys(response).map((key) => {
        		if (Object.keys(response[key]).length !== 0) {
                    checkedBox = true
				}
			});
            dispatch({
                type: PICK_TEMPLATE_SUCCESS,
                data: response,
            });
        });
    };
};

export const changeTemplate = (auth, locale) => {
	return dispatch => {
        dispatch({
            type: PICK_TEMPLATE_CHANGED,
            auth: '',
            locale: ''
        });
		setTimeout(() => dispatch({
			type: PICK_TEMPLATE_CHANGED,
			auth: auth,
			locale: locale
		}), 100);
	};
};

export const changeTemplateHtml = (html) => {
	return dispatch => {
		dispatch({
			type: CHANGE_TEMPLATE_HTML,
			html: html
		});
	};
};

export const saveAllContent = (saveObject) => {
	// TO DO SAVE STUFF WOHOO
	console.log(saveObject);
    return dispatch => {
        dispatch({
            type: ''
        });
    };
};

export const showDialog = () => {
	return dispatch => {
		dispatch({
			type: SHOW_DIALOG
		});
	};
};

export const hideDialog = () => {
	return dispatch => {
		dispatch({
			type: HIDE_DIALOG
		});
	};
};

export const showContentDialog = () => {
	return dispatch => {
		dispatch({
			type: SHOW_CONTENT_DIALOG
		});
	};
};

export const hideContentDialog = () => {
	return dispatch => {
		dispatch({
			type: HIDE_CONTENT_DIALOG
		});
	};
};

export const showImportDialog = () => {
	return dispatch => {
		dispatch({
			type: SHOW_IMPORT_DIALOG
		});
	};
};

export const hideImportDialog = () => {
	return dispatch => {
		dispatch({
			type: HIDE_IMPORT_DIALOG
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
	templateHTML: '',
	showDialog: false,
	showContentDialog: false
}, action) {
	switch (action.type) {
	case FETCH_SUCCESS:
		return Object.assign({}, state, {
			list: action.data,
		});
	case PICK_VERSION_BEGIN:
		return Object.assign({}, state, {
			version: action.version,
			templates: [],
			openContent: false
		});
		break;
	case ADD_RELEASE:
		return Object.assign({}, state, {
			list: state.list.concat(action.data)
		});
		break;
	case PICK_VERSION_SUCCESS:
		return Object.assign({}, state, {
			templates: action.data
		});
		break;
	case PICK_TEMPLATE_BEGIN:
		return Object.assign({}, state, {
			template: action.template,
			templateOptions: action.options,
			templateHTML: 'Please wait...Loading',
			openContent: true,
            saveContentButton: false
        });
		break;
	case PICK_TEMPLATE_SUCCESS:
		let key = Object.keys(action.data.anonymous)[0];
		let auth = Object.keys(action.data)[0];
		let html = action.data.anonymous[key];
		return Object.assign({}, state, {
			templateApiInfo: action.data,
			templateHTML: html,
            locale: key,
            auth: auth
		});
		break;
	case PICK_TEMPLATE_CHANGED:
		return Object.assign({}, state, {
            templateHTML: state.templateApiInfo && state.templateApiInfo[action.auth] && state.templateApiInfo[action.auth][action.locale] || 'No content',
			locale: action.locale,
			auth: action.auth
		});
		break;
	case SHOW_DIALOG:
		return Object.assign({}, state, {
			showDialog: true
		});
		break;
	case HIDE_DIALOG:
		return Object.assign({}, state, {
			showDialog: false
		});
		break;
	case SHOW_CONTENT_DIALOG:
		return Object.assign({}, state, {
			showContentDialog: true
		});
		break;
	case HIDE_CONTENT_DIALOG:
		return Object.assign({}, state, {
			showContentDialog: false
		});
		break;
	case CHANGE_TEMPLATE_HTML:
		state.templateApiInfo[state.auth][state.locale] = action.html;
		return Object.assign({}, state, {
			templateHTML: action.html,
            templateApiInfo: state.templateApiInfo,
			saveContentButton: true
        });
		break;
	default:
		return state;
	}
}


