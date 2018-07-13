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

const CHANGE_CHECKBOX = 'CHANGE_CHECKBOX';

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

export const initialTemplate = (v, t, market, languages) => {
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
        			if (key !== 'anonymous') {
                        checkedBox = true
                    }
				}
			});

            dispatch({
                type: PICK_TEMPLATE_SUCCESS,
                data: response,
                checkboxCheck: checkedBox,
				languages: languages
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

export const changeTemplateHtml = (html, languages) => {
	return dispatch => {
        dispatch({
            type: CHANGE_TEMPLATE_HTML,
            html: '',
            languages: ''
        });
        setTimeout(() => dispatch({
            type: CHANGE_TEMPLATE_HTML,
            html: html,
            languages: languages
        }), 100);
	};
};

export const saveAllContent = (saveObject) => {
	// TO DO SAVE STUFF WOHOO
	console.log(saveObject);
    return dispatch => {
        dispatch({
            type: '',
			changed: {}
        });
    };
};

export const specifyContentCheckBox = (checkboxCheck) => {
    return dispatch => {
        dispatch({
            type: CHANGE_CHECKBOX,

        });
        setTimeout(() => dispatch({
            type: CHANGE_CHECKBOX,
            checkboxCheck: checkboxCheck
        }), 100);
    };
}

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
		var valid = true;
        if (action.checkboxCheck) {
            Object.keys(action.data).map((key) => {
                let obj = action.data[key];
                valid = valid && Object.keys(obj).length === action.languages.length;
            })
        } else {
            valid = valid && Object.keys(action.data['anonymous']).length === action.languages.length;
        }
		return Object.assign({}, state, {
			templateApiInfo: action.data,
			templateHTML: html,
            locale: key,
            auth: auth,
            checkboxCheck: action.checkboxCheck,
            saveContentButton: valid,
			languages: action.languages,
			changed: {}
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
		if (Array.isArray(state.changed[state.auth])) {
			if (state.changed[state.auth].indexOf(state.locale) === -1) {
                state.changed[state.auth].push(state.locale)
            }
		} else {
            state.changed[state.auth] = [];
            state.changed[state.auth].push(state.locale);
		}
        var valid = true;
        if (state.checkboxCheck) {
            Object.keys(state.templateApiInfo).map((key) => {
                let obj = state.templateApiInfo[key];
                valid = valid && Object.keys(obj).length === state.languages.length;
            })
        } else {
            valid = valid && Object.keys(state.templateApiInfo['anonymous']).length === state.languages.length;
        }
		return Object.assign({}, state, {
			templateHTML: action.html,
            templateApiInfo: state.templateApiInfo,
            saveContentButton: valid
        });
		break;
	case CHANGE_CHECKBOX:
        var valid = true;
        if (!action.checkboxCheck) {
            Object.keys(state.templateApiInfo).map((key) => {
                let obj = state.templateApiInfo[key];
                valid = valid && Object.keys(obj).length === state.languages.length;
            })
        } else {
            valid = valid && Object.keys(state.templateApiInfo['anonymous']).length === state.languages.length;
        }
		return Object.assign({}, state, {
            checkboxCheck: !action.checkboxCheck,
            saveContentButton: valid
        });
		break;
	default:
		return state;
	}
}


