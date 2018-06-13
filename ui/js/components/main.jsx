import React, { Component } from 'react';
import { connect } from 'react-redux';

import {watch} from '../ducks/versions.js';
import {changePage} from '../ducks/navigation.js';



import Versions from './tables/versions.jsx';
// import Templates  from './tables/versions.jsx';
let Tables = {
	versions: <Versions key="table"/>,
	// templates: Templates
};


class ProductList extends React.Component {
  componentDidMount() {
    this.props.watch();
  }

  render() {
	return [
		<header key="header">
			<a href="#versions" className={this.props.page=="versions"?'selected':''} onClick={this.props.changeTab.bind(null, "versions")}>Versions</a>
			<a href="#templates" className={this.props.page=="templates"?'selected':''} onClick={this.props.changeTab.bind(null, "templates")}>Templates</a>
		</header>,
		Tables[this.props.page]
    ];
  }
};


// let App = (props) => {
// 	console.log(props);
// 	props.dispatch(watch());
// 	return [
//         <Header key='1' />,
//         'HELLO',
//         <Footer key='2' />
//     ];
// };

export default connect(state=>({
	versions: state.version.list,
	page: state.navigation.page
}), dispatch=>({
	watch: () =>dispatch(watch()),
	changeTab: (page,e) =>{
		e.preventDefault();
		dispatch(changePage(page));
		return false;
	},
	onSomeClick: (version)=>{
		console.log("DO SOMETHING", version);
	}
}))(ProductList);
