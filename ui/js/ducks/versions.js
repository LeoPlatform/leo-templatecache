import async from "async";

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

const WRAPPED_HTML = 'WRAPPED_HTML';

const CLEAR = 'VERSIONS_CLEAR';

const SHOW_DIALOG = 'VERSIONS_SHOW_DIALOG';
const HIDE_DIALOG = 'VERSIONS_HIDE_DIALOG';

const SHOW_CONTENT_DIALOG = 'VERSIONS_SHOW_CONTENT_DIALOG';
const HIDE_CONTENT_DIALOG = 'VERSIONS_HIDE_CONTENT_DIALOG';

const SHOW_IMPORT_DIALOG = 'VERSIONS_SHOW_IMPORT_DIALOG';
const HIDE_IMPORT_DIALOG = 'VERSIONS_HIDE_IMPORT_DIALOG';

const SHOW_EDIT_DIALOG = 'SHOW_EDIT_DIALOG';
const HIDE_EDIT_DIALOG = 'HIDE_EDIT_DIALOG';

const EDIT_RELEASE = 'EDIT_RELEASE';

const CHANGE_CHECKBOX = 'CHANGE_CHECKBOX';

const TEXT_AREA_CHANGED = 'TEXT_AREA_CHANGED';

const IMPORT_DRUPAL = 'IMPORT_DRUPAL';

const SAVE_CONTENT_BEGIN = 'VERSIONS_SAVE_CONTENT_BEGIN';
const SAVE_CONTENT_SUCCESS = 'VERSIONS_SAVE_CONTENT';

//Action Functions
export const watch = (market) => {
	return dispatch => {
		dispatch({
			type: CLEAR
		});
        async.parallel({
            one: (done) => {
                $.get(`api/version/${market}`, response => {
                    done(null, {data: response});
                });
            },
            two: (done) => {
            	if (market !== 'GLBL') {
                    $.get(`api/version/GLBL`, response => {
                        done(null, {data: response});
                    });
                } else {
                    done(null, {data: null});
				}
            }
        }, (err, results) => {
            dispatch({
                type: FETCH_SUCCESS,
                data: results.one.data,
				glblData: market !== 'GLBL' ? results.two.data : []
            });
        });
	};
};

export const changeVersion = (v, market) => {
    return dispatch => {
        dispatch({
            type: PICK_VERSION_BEGIN,
            version: v
        });
        async.parallel({
            one: (done) => {
                $.get(`api/version/${market}/${v.id}`, response => {
                    done(null, {data: response});
                });
            },
            two: (done) => {
				$.get(`api/template/wrapper_site_main?browser=true&asOf=${v.id}`, response => {
					done(null, {files: response.files, map: response.map});
				});
            }
        }, (err, results) => {
            dispatch({
                type: PICK_VERSION_SUCCESS,
                data: results.one.data,
				wrapperFiles: results.two.files,
				wrapperMap: results.two.map,
            });
        });
    }
};

export const createRelease = (timestamp, name, market) => {
	return dispatch => {
		dispatch({
			type: ADD_RELEASE,
			data: {
				id: timestamp,
				name: name,
				markets: [market]
			}
		});
		$.post(`api/version/${market}`, JSON.stringify({name, timestamp}), response => {
			dispatch({
				type: ADD_RELEASE,
				data: response
			});
		});
	}
};

export const editRelease = (edit, old, market, markets) => {
    return dispatch => {
        dispatch({
            type: EDIT_RELEASE,
            edit: edit,
			old: old,
			markets: markets
        });
        $.post(`api/version/${market}/${old.id}`, JSON.stringify(edit));
    }
};

export const importFromDrupal = (url, customerUrl, presenterUrl, template) => {
	console.log(url, customerUrl, presenterUrl, template)
    return dispatch => {
        dispatch({
            type: IMPORT_DRUPAL,
            // data: {
            //     url: url
            // }
        });
        // $.post(``, JSON.stringify({url}), response => {
        //     dispatch({
        //         type: IMPORT_DRUPAL,
        //         data: response
        //     });
        // });
    }
};

export const initialTemplate = (v, t, market, languages, wrapperMap, templateId) => {
	return dispatch => {
		dispatch({
			type: PICK_TEMPLATE_BEGIN,
			template: t
		});
        $.get(`api/templateVersion/${market}/${v.id}/${t.id}`, response => {
			// Change checkbox to have this state
			let checkedBox = false;
			Object.keys(response).map((key) => {
				if (Object.keys(response[key]).length !== 0) {
					if (key !== 'anonymous') {
						checkedBox = true
					}
				}
			});

            let wrapCheck =  `locale=${languages[0]}&auth=${Object.keys(response)[0]}`;
            let wrapperMapValue = wrapperMap && wrapperMap[wrapCheck];
            dispatch({
                type: PICK_TEMPLATE_SUCCESS,
                data: response,
                wrapperMapValue: '',
                templateId: '',
                checkboxCheck: '',
                languages: ''
            });
            setTimeout(() => dispatch({
                type: PICK_TEMPLATE_SUCCESS,
                data: response,
                wrapperMapValue: wrapperMapValue,
                templateId: templateId,
                checkboxCheck: checkedBox,
                languages: languages
            }), 100);
		});
	};
};

export const changeTemplate = (auth, locale, wrapperMap, templateId) => {
    return dispatch => {
        let wrapCheck =  `locale=${locale}&auth=${auth}`;
        let wrapperMapValue = wrapperMap && wrapperMap[wrapCheck];
        dispatch({
            type: PICK_TEMPLATE_CHANGED,
            auth: '',
            locale: '',
            wrapperMapValue: '',
            templateId: ''
        });
        setTimeout(() => dispatch({
            type: PICK_TEMPLATE_CHANGED,
            auth: auth,
            locale: locale,
            wrapperMapValue: wrapperMapValue,
            templateId: templateId
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

export const saveAllContent = (market, version, template, saveObject) => {
	return dispatch => {
 		dispatch({
			type: SAVE_CONTENT_BEGIN
		});
		$.post(`api/templateVersion/${market}/${version}/${template}`, JSON.stringify(saveObject), response => {
			dispatch({
				type: SAVE_CONTENT_SUCCESS
			});
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

export const showEditDialog = () => {
    return dispatch => {
        dispatch({
            type: SHOW_EDIT_DIALOG
        });
    };
};

export const hideEditDialog = () => {
    return dispatch => {
        dispatch({
            type: HIDE_EDIT_DIALOG
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

export const textAreaChanged = () => {
    return dispatch => {
        dispatch({
            type: TEXT_AREA_CHANGED
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
    showDrupalDialog: false,
	showContentDialog: false,
    showEditDialog: false
}, action) {
	switch (action.type) {
		case FETCH_SUCCESS:
		let data = [...action.data, ...action.glblData].sort((a,b) => a.id-b.id);
		return Object.assign({}, state, {
			list: data.sort((a,b) => a.id-b.id),
		});
	break
	case PICK_VERSION_BEGIN:
		return Object.assign({}, state, {
			version: action.version,
			templates: [],
			openContent: false,
            wrapperFiles: '',
            wrapperMap: '',
            wrapperMapValue: '',
            wrappedHTML: ''
        });
		break;
	case CLEAR:
		return Object.assign({}, state, {
			list: [],
			templates: [],
			templateApiInfo: [],
			openContent: false,
			version: {id: null}
		});
		break;
	case ADD_RELEASE:
		return Object.assign({}, state, {
			list: state.list.concat(action.data).sort((a,b) => a.id-b.id)
		});
		break;
	case IMPORT_DRUPAL:
		return Object.assign({}, state, {
		});
		break;
	case PICK_VERSION_SUCCESS:
        return Object.assign({}, state, {
			templates: action.data,
            wrapperFiles: action.wrapperFiles,
            wrapperMap: action.wrapperMap,
            wrapperMapValue: action.wrapperMapValue
        });
		break;
	case PICK_TEMPLATE_BEGIN:
		return Object.assign({}, state, {
			template: action.template,
			templateOptions: action.options,
			templateHTML: 'Please wait...Loading',
			openContent: true,
			saveContentButton: false,
            wrappedHTML: '',
			wrapperMapValue: ''
		});
		break;
	case SAVE_CONTENT_SUCCESS:
        return Object.assign({}, state, {
            changed: {}
        });
        break;
	case PICK_TEMPLATE_SUCCESS:
		let key = Object.keys(action.data.anonymous)[0];
		let auth = Object.keys(action.data)[0];
		let html = action.data.anonymous[key] || 'No Content';
		var valid = true;
		if (action.checkboxCheck) {
			Object.keys(action.data).map((key) => {
				let obj = action.data[key];
				valid = valid && Object.keys(obj).length === action.languages.length;
			})
		} else {
			valid = valid && Object.keys(action.data['anonymous']).length === action.languages.length;
		}
        let wrapHTML;
        if (action.templateId !== 'wrapper_site_main' && state.wrapperFiles && state.wrapperFiles[action.wrapperMapValue]) {
            wrapHTML = state.wrapperFiles[action.wrapperMapValue].replace('__CONTENT__', html);
        } else {
        	wrapHTML = html;
		}
		return Object.assign({}, state, {
			templateApiInfo: action.data,
			templateHTML: html,
			locale: key,
			auth: auth,
			checkboxCheck: action.checkboxCheck,
			saveContentButton: valid,
			languages: action.languages,
			changed: {},
            wrappedHTML: wrapHTML,
            wrapperMapValue: action.wrapperMapValue
        });
		break;
	case PICK_TEMPLATE_CHANGED:
		let templateHTML = state.templateApiInfo && state.templateApiInfo[action.auth] && state.templateApiInfo[action.auth][action.locale] || 'No content';
        let wrapHTML2;
        if (action.templateId !== 'wrapper_site_main' && state.wrapperFiles && state.wrapperFiles[action.wrapperMapValue]) {
            wrapHTML2 = state.wrapperFiles[action.wrapperMapValue].replace('__CONTENT__', templateHTML);
        } else {
            wrapHTML2 = templateHTML;
        }
		return Object.assign({}, state, {
			templateHTML: templateHTML,
            locale: action.locale,
			auth: action.auth,
            wrappedHTML: wrapHTML2,
			wrapperMapValue: action.wrapperMapValue
        });
		break;
	case EDIT_RELEASE:
        let toDelete = new Set([action.old.id]);
        let newList = state.list.filter(obj => !toDelete.has(obj.id));
        let id = action.edit.id ? action.edit.id : action.old.id;
        let updatedVersion = {id: id, name: action.edit.name, markets: action.markets};
        return Object.assign({}, state, {
            list: newList.concat(updatedVersion).sort((a,b) => a.id-b.id)
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
	case SHOW_EDIT_DIALOG:
		return Object.assign({}, state, {
            showEditDialog: true
		});
		break;
	case HIDE_EDIT_DIALOG:
		return Object.assign({}, state, {
			showEditDialog: false
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
	case SHOW_IMPORT_DIALOG:
		return Object.assign({}, state, {
            showDrupalDialog: true
		});
		break;
	case HIDE_IMPORT_DIALOG:
		return Object.assign({}, state, {
            showDrupalDialog: false
		});
		break;
	case TEXT_AREA_CHANGED:
		let changes = !state.codeChange;
		if(state.codeChanged) {
			changes = true;
		}
		return Object.assign({}, state, {
            codeChanged: changes
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
		let wrapHTML3;
        if (state.templateId !== 'wrapper_site_main' && state.wrapperFiles && state.wrapperFiles[state.wrapperMapValue]) {
            wrapHTML3 = state.wrapperFiles[state.wrapperMapValue].replace('__CONTENT__', action.html);
        } else {
            wrapHTML3 = action.html;
        }
		return Object.assign({}, state, {
			templateHTML: action.html,
			templateApiInfo: state.templateApiInfo,
			saveContentButton: valid,
            wrappedHTML: wrapHTML3
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
