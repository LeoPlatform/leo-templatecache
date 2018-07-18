import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import {hideImportDialog, importFromDrupal} from '../../ducks/versions.js';

class importDrupalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            urlCustomer: '',
            urlPresenter: ''
        };
    }

    createRelease() {
        this.props.hideDrupalDialog();
        this.props.importFromDrupal(this.state.url, this.state.urlCustomer, this.state.urlPresenter, this.props.template);
        this.setState({
            url: '',
            urlCustomer: '',
            urlPresenter: ''
        })
    }

    render() {

        return (<Dialog
            open={this.props.showDrupalDialog}
            onClose={this.props.hideDrupalDialog}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Import From Drupal</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please specify the Drupal URL you would like to import
                </DialogContentText>
                <TextField
                    margin="dense"
                    id="url"
                    onChange={e=>this.setState({url: e.target.value})}
                    label="URL"
                    type="text"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="urlCustomer"
                    onChange={e=>this.setState({urlCustomer: e.target.value})}
                    label="URL For Customer"
                    type="text"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="urlPresenter"
                    onChange={e=>this.setState({urlPresenter: e.target.value})}
                    label="URL For Presenter"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>this.props.hideDrupalDialog()} color="primary">
                    Cancel
                </Button>
                <Button onClick={()=>{
                    this.createRelease()
                }} color="primary">
                    Import
                </Button>
            </DialogActions>
        </Dialog>);
    }
}


export default connect(state => ({
    showDrupalDialog: state.version.showDrupalDialog,
    template: state.version.template
}), (dispatch, props) => ({
    hideDrupalDialog: () => {
        dispatch(hideImportDialog());
    },
    importFromDrupal: (url, urlCustomer, urlPresenter, template) => {
        dispatch(importFromDrupal(url, urlCustomer, urlPresenter, template));
    }
}))(importDrupalDialog);

