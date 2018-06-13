import React, { Component } from 'react';
import { connect } from 'react-redux';

import Footer from './Sections/footer.jsx';
import Header from './Sections/header.jsx';


import {watch} from '../ducks/versions.js';


class ProductList extends React.Component {
  componentDidMount() {
    this.props.watch();
  }

  render() {
	return [
        <Header key='1' />,
        this.props.versions.map(v=>(
        	<div key={v.id} onClick={this.props.onSomeClick.bind(null, v)}>
        	{v.id}
        	</div>
        )),
        <Footer key='2' />
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
	versions: state.version.list
}), dispatch=>({
	watch: () =>dispatch(watch()),
	onSomeClick: (version)=>{
		console.log("DO SOMETHING", version);
	}
}))(ProductList);
