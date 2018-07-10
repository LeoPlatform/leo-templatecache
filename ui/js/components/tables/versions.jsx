import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import CreateVersion from './createVersionDialog.jsx';
import SetContentDialog from './setContentDialog.jsx';


import moment from 'moment';

import {changeVersion, changeTemplate,changeTemplateOptions, createRelease, showDialog, showContentDialog, showImportDialog} from '../../ducks/versions.js';

import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

class VersionTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      dialog: false
    };
	}
	render() {
        const { classes } = this.props;

        console.log(classes);
		return [
            <div className="view" key="view">
                <iframe src={"data:text/html;charset=utf-8,"+encodeURI(this.props.templateHTML)}>

                </iframe>
            </div>,
            <div className="select" key="versions">
                <div>
                    <h3>Choose a Release</h3>
                    <Button variant="contained" color="primary" className={classes.button} onClick={()=>this.props.showDialog()}>
                      Create a Release
                    </Button>                
                    <CreateVersion></CreateVersion>    
                    <MenuList id="versionlist" component="div" >
                     {this.props.versions.map((v,i)=>{
                      console.log(v);
                         return [i==0?null:<Divider />, 
                         <MenuItem button className={classes.menuItem} onClick={()=>this.props.versionSelect(v)}>
                            <ListItemText  classes={{ primary: classes.primary, secondary: classes.primary }} primary={moment(v.ts).format('LLLL')} secondary={v.id}/>
                         </MenuItem>]
                    })}
                    </MenuList>
                </div>
                <div>
                    <h3>Choose a Path</h3>
                    <MenuList id="versionlist" component="div" >
                     {this.props.templates.map((t,i)=>{
                         return [i==0?null:<Divider />, 
                         <MenuItem button className={classes.menuItem} onClick={()=>this.props.templateSelect(t, this.props.version,this.props.templateOptions)}>
                            <ListItemText  classes={{ primary: classes.primary, secondary: classes.primary }} primary={t.id} secondary={t.v===null?'Unchanged':''}/>
                         </MenuItem>]
                    })}
                    </MenuList>
                </div>
                <div>
                    <h3>Specify Content</h3>
                    <SetContentDialog></SetContentDialog>
                    Import from drupal <CloudUploadIcon  />
                      <ul>
                        {this.props.languages.map(l=>{
                          return <li onClick={()=>this.props.templateSelect(this.props.template, this.props.version, {market: this.props.market, locale: l})}>{l} <IconButton size="small"  color="secondary" aria-label="edit" className={classes.button} onClick={this.props.showContentDialog}><Icon>edit_icon</Icon></IconButton></li>
                        })}
                      </ul>

                    <FormControlLabel control={<Checkbox checked={false} onChange={()=>{}} value="checkedB"/>} label="Specify pages for Customer/Presenter"/>
                    Customer Version<br />
                      Import from drupal <CloudUploadIcon  />
                      <ul>
                        {this.props.languages.map(l=>{
                          return <li onClick={()=>this.props.templateSelect(this.props.template, this.props.version, {auth: "customer", market: this.props.market, locale: l})}>{l} <IconButton size="small"  color="secondary" aria-label="edit" className={classes.button} onClick={this.props.showContentDialog}><Icon>edit_icon</Icon></IconButton></li>
                        })}
                      </ul>

                      Presenter Version<br />
                      Import from drupal <CloudUploadIcon  />
                      <ul>
                        {this.props.languages.map(l=>{
                          return <li onClick={()=>this.props.templateSelect(this.props.template, this.props.version, {auth: "presenter", market: this.props.market, locale: l})}>{l} <IconButton size="small"  color="secondary" aria-label="edit" className={classes.button} onClick={this.props.showContentDialog}><Icon>edit_icon</Icon></IconButton></li>
                        })}
                      </ul>



                    <Button variant="contained" color="primary" className={classes.button} onClick={()=>this.props.saveContent()}>
                      Save Content
                    </Button>      


                </div>
            </div>
		];
	}
}
export default connect(state => ({
  market: state.market.id,
	versions: state.version.list,
    version: state.version.version,
    template: state.version.template,
    templateOptions: state.version.templateOptions,
    templateHTML: state.version.templateHTML,
    templates: state.version.templates,
    languages: state.market.languages
}), (dispatch, props) => ({
	versionSelect: (version) => {
        dispatch(changeVersion(version));
	},
    templateSelect: (template,version, options) => {
        dispatch(changeTemplate(version, template, options));
    },
    createRelease: ()=>{
      dispatch(createRelease("Another test", Date.now()));
    },
    showDialog: ()=>{
      dispatch(showDialog());
    },
    showContentDialog: ()=>{
      dispatch(showContentDialog());
    },
    showImportDialog: ()=>{
      dispatch(showImportDialog());
    },
    saveContent: ()=>{
      alert("TO DO STILL");
    }
}))(withStyles(styles)(VersionTable));
