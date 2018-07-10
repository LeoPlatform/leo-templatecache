import React, { Component } from 'react';
import { connect } from 'react-redux';

import {watch} from '../ducks/versions.js';
import {changeMarket} from '../ducks/market.js';


import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import Versions from './tables/versions.jsx';

class ProductList extends React.Component {
  componentDidMount() {
    this.props.watch();
  }

  render() {
	return [
		<AppBar position="static">
		<Typography variant="title" color="inherit">
			 <Toolbar>
              Choose a Market
				<Tabs value={this.props.market} onChange={this.props.changeTab} color="inherit">
					<Tab label="US" value="US"/>
					<Tab label="Australia" value="AU"/>
					<Tab label="United Kingdoom" value="UK"/>
					<Tab label="New Zealand" value="NZ"/>
					<Tab label="Germany" value="DE"/>
					<Tab label="Spain" value="ES"/>
				</Tabs>
		 </Toolbar>
         </Typography>
	    </AppBar>,
		<Typography component="div"><Versions key="table"/></Typography>
    ];
  }
};

export default connect(state=>({
	versions: state.version.list,
	market: state.market.id
}), dispatch=>({
	watch: () =>dispatch(watch()),
	changeTab: (e,market) =>{
		dispatch(changeMarket(market));
		return false;
	},
	onSomeClick: (version)=>{
		console.log("DO SOMETHING", version);
	}
}))(ProductList);
