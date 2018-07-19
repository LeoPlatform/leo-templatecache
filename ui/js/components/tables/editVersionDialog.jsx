import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import moment from 'moment';

import {hideEditDialog,editRelease} from '../../ducks/versions.js';

class editVersionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(this.props.version.id).format("YYYY-MM-DDTHH:mm"),
            name: this.props.version.name
        };
    }

    componentWillReceiveProps(props) {
        let setDate = this.state.date;
        let setName = this.state.name;
        if (this.state.date !== moment(props.version.id).format("YYYY-MM-DDTHH:mm")) {
            setDate = moment(props.version.id).format("YYYY-MM-DDTHH:mm");
        }
        if (this.state.name !== props.version.name) {
            setName = props.version.name;
        }
        this.setState({
            date: setDate,
            name: setName
        })
    }

    editRelease() {
        this.props.hideEditDialog();
        let newId = moment(this.state.date).valueOf();
        let edits = {name: this.state.name};
        if (this.state.date !== moment(this.props.version.id).format("YYYY-MM-DDTHH:mm")) {
            edits['id'] = newId;
        }
        let old = {id: moment(this.props.version.id).valueOf(), name: this.props.version.name};
        this.props.editRelease(edits, old, this.props.market, this.props.version.markets);
    }

    render() {
        return (<Dialog
            open={this.props.showEditDialog}
            onClose={this.props.hideEditDialog}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Edit Release</DialogTitle>
            <DialogContent>
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
                    defaultValue={this.state.name}
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>this.props.hideEditDialog()} color="primary">
                    Cancel
                </Button>
                <Button onClick={()=>{
                    this.editRelease()
                }} color="primary">
                    Edit Release
                </Button>
            </DialogActions>
        </Dialog>);
    }
}


export default connect(state => ({
    showEditDialog: state.version.showEditDialog,
    version: state.version.version,
    market: state.market.id
}), (dispatch, props) => ({
    hideEditDialog: () => {
        dispatch(hideEditDialog());
    },
    editRelease: (edit, old, market, markets) =>{
        dispatch(editRelease(edit, old, market, markets));
    }
}))(editVersionDialog);

