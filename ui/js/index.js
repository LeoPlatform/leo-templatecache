import React from 'react';
import {
	render
} from 'react-dom';
import {
	Provider
} from 'react-redux';
import {
	createStore,
	applyMiddleware
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducer.js';
import Main from './components/main.jsx';
//Set up CSS required
import "../css/main.less";

const store = createStore(reducer,
	applyMiddleware(
		thunkMiddleware
	)
);

$(() => {
	LEOCognito.start('us-west-2:aa1428e4-3b13-4dc2-ac73-e2f8c9e5a3b4', false, {
		apiUri: "api/",
		region: "us-west-2",
		cognito_region: "us-west-2"
	});
	render(
		<Provider store={store}>
			<Main />
		</Provider>, document.getElementById('root'));
});

if (module.hot) {
	module.hot.accept("./components/main.jsx", () => {
		const Main = require('./components/main.jsx').default;
		render(
			<Provider store={store}>
				<Main />
			</Provider>, document.getElementById('root'));
	});
}
