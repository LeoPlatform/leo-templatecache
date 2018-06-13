import React, {Component} from 'react';
import {connect} from 'react-redux';

// import {navigateTo} from '../../actions/action.js';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <header>
            	<ul>
            		<li onClick={()=>this.changePage("home")} className={this.props.page === "home"?'selected':''}>Home</li>
            		<li onClick={()=>this.changePage("sub")} className={this.props.page === "sub"?'selected':''}>Sub</li>
            	</ul>
                {this.state.test}
            </header>
        );
    }
    changePage(page) {
        this.setState({test: "I was set"});
    	// this.props.dispatch(navigateTo(page));
    }
}

export default connect((state) => {
	return state;
})(Header);
