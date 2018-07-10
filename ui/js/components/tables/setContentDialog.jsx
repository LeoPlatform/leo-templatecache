import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
	connect
} from 'react-redux';

import {hideContentDialog,saveTemplateVersion} from '../../ducks/versions.js';

import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  }
});

class FormDialog extends React.Component {
  constructor(props) {
	super(props);
  this.classes = props;
	this.state = {
		date: moment().add(1, 'week').format("YYYY-MM-DDTHH:mm"),
		name: 'test'
	};
  }

  render() {
    return (<Dialog
      open={this.props.showDialog}
      onClose={this.props.hideDialog}
      aria-labelledby="form-dialog-title"
      classes={{
         paper: this.classes.dialog,
      }}
      maxWidth={false}
    >
      <DialogTitle id="form-dialog-title">Specify content for site_wrapper (default)</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please specify when you would like this to be released {this.props.languages.toString()}
        </DialogContentText>
        <textarea style={{width: 700, height: 500}}></textarea>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>this.props.hideDialog()} color="primary">
          Cancel
        </Button>
        <Button onClick={()=>{
        	console.log(this.state);
        	this.props.createRelease(this.state.date, this.state.name)
        }} color="primary">
          Change Content
        </Button>
      </DialogActions>
    </Dialog>);
  }
}


export default connect(state => ({
  showDialog: state.version.showContentDialog,
  languages: state.market.languages,
}), (dispatch, props) => ({
	hideDialog: () => {
        dispatch(hideContentDialog());
	},
	createRelease: (timestamp, name) =>{
		dispatch(createRelease(moment(timestamp).valueOf(), name));
	}
}))(FormDialog);

