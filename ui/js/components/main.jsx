import React from 'react';
import { connect } from 'react-redux';

import {changeMarket} from '../ducks/market.js';


import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import Versions from './tables/versions.jsx';

class ProductList extends React.Component {
  componentDidMount() {
    this.props.init();
  }

  versionSelected(label, val) {
  	if (this.props.version && this.props.version.markets && this.props.version.markets.indexOf(val) !== -1 || (this.props.market.toLowerCase() === val && this.props.version.id !== null)) {
		return `*${label}`;
	}
	return label;
  }

  render() {
	return [
		<AppBar position="static">
		<Typography variant="title" color="inherit">
			 <Toolbar>
              Choose a Market
				<Tabs value={this.props.market} onChange={this.props.changeTab} color="inherit">
					<Tab label={this.versionSelected('Global', 'glbl')} value="GLBL"/>
					<Tab label={this.versionSelected('US', 'us')} value="US"/>
					<Tab label={this.versionSelected('Australia', 'au')} value="AU"/>
					<Tab label={this.versionSelected('United Kingdoom', 'uk')} value="UK"/>
					<Tab label={this.versionSelected('New Zealand', 'nz')} value="NZ"/>
					<Tab label={this.versionSelected('Germany', 'de')} value="DE"/>
					<Tab label={this.versionSelected('Spain', 'es')} value="ES"/>
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
	market: state.market.id,
	version: state.version.version
}), dispatch=>({
	init: () =>dispatch(changeMarket("US")),
	changeTab: (e,market) =>{
		dispatch(changeMarket(market));
		return false;
	}
}))(ProductList);
