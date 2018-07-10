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

import reducer from './reducers/index.js';
import Main from './components/main.jsx';
//Set up CSS required
import "../css/main.less";

const store = createStore(reducer,
	applyMiddleware(
		thunkMiddleware
	)
);

$(() => {
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
