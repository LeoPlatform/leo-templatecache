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

import {hideDialog,createRelease} from '../../ducks/versions.js';

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
  },
});





class FormDialog extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
		date: moment().add(1, 'week').format("YYYY-MM-DDTHH:mm"),
		name: 'test'
	};
  }

  createRelease() {
      this.props.hideDialog();
      this.props.createRelease(this.state.date, this.state.name, this.props.market)
  }

  render() {
    return (<Dialog
          open={this.props.showCreateVersionDialog}
          onClose={this.props.hideDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a new Release</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please specify when you would like this to be released
            </DialogContentText>

             <TextField
                autoFocus
		        id="releaseDate"
		        label="Release Date"
		        onChange={e=>this.setState({date: e.target.value})}
		        type="datetime-local"
		        defaultValue={this.state.date}
		        InputLabelProps={{
		          shrink: true,
		        }}
	        />
            <TextField
              margin="dense"
              id="name"
              onChange={e=>this.setState({name: e.target.value})}
              label="Release Name"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.props.hideDialog()} color="primary">
              Cancel
            </Button>
            <Button onClick={()=>{
            	this.createRelease()
            }} color="primary">
              Create Release
            </Button>
          </DialogActions>
        </Dialog>);
  }
}


export default connect(state => ({
  showCreateVersionDialog: state.version.showDialog,
  market: state.market.id
}), (dispatch, props) => ({
	hideDialog: () => {
        dispatch(hideDialog());
	},
	createRelease: (timestamp, name,market) =>{
		dispatch(createRelease(moment(timestamp).valueOf(), name,market));
	}
}))(FormDialog);

