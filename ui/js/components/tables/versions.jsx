import React from 'react';
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

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import CreateVersion from './createVersionDialog.jsx';

import moment from 'moment';

import {changeVersion, changeTemplate, createRelease, showDialog, showContentDialog, changeTemplateHtml, initialTemplate, saveAllContent} from '../../ducks/versions.js';

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
            dialog: false,
            checked: false,
            value: 0
        };
	}

	render() {
        const { classes } = this.props;
        const { value } = this.state;
        let unorderedListStyle = {listStyle: 'none', paddingLeft: '20px'};
        let listItemOverrides = {height: '100%', whiteSpace: 'normal'};
        let specifyContentPadding = {paddingLeft: '12px'};
        let unorderedListItemPadding = {paddingBottom: '5px'};
        $('#htmlTextArea').val(this.props.templateHTML);

		return [
            <div className="view" key="view">
                <AppBar className="appBar" position="static">
                    <Tabs value={value} onChange={(event, value)=> {this.setState({ value })}}>
                        <Tab label="Preview" />
                        <Tab label="Code" />
                    </Tabs>
                </AppBar>
                {value === 0 && <iframe src={"data:text/html;charset=utf-8,"+encodeURI(this.props.templateHTML)}></iframe>}
                {
                    value === 1 &&
                    <div style={{width: '100%', height: '100%'}}>
                        <textarea id="htmlTextArea" style={{width: '99%', height: '92%'}}>{this.props.templateHTML}</textarea>
                        <div style={{width:'100%', boxSizing:'border-box', height:'8%',padding:'5px'}}>
                            <Button variant="contained" color="primary" className={classes.button} onClick={()=>this.props.changeContent($('#htmlTextArea').val())}>
                                Change Content
                            </Button>
                        </div>
                    </div>
                }
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
                      let isSelected = v.id === this.props.version.id;
                         return [i==0?null:<Divider />, 
                         <MenuItem button selected={isSelected} style={listItemOverrides} onClick={()=>this.props.versionSelect(v)}>
                            <ListItemText  classes={{ primary: classes.primary, secondary: classes.primary }} primary={moment(v.ts).format('LLLL')} secondary={v.id}/>
                         </MenuItem>]
                    })}
                    </MenuList>
                </div>
                <div>
                    <h3>Choose a Path</h3>
                    <MenuList id="versionlist" component="div" >
                     {this.props.templates.map((t,i)=>{
                         let isSelected = t.id === this.props.template.id && this.props.openContent;
                         return [i==0?null:<Divider />,
                         <MenuItem button selected={isSelected} style={listItemOverrides} onClick={()=>this.props.initialTemplate(t, this.props.version,this.props.market)}>
                            <ListItemText  classes={{ primary: classes.primary, secondary: classes.primary }} primary={t.id} secondary={t.v===null?'Unchanged':''}/>
                         </MenuItem>]
                    })}
                    </MenuList>
                </div>
                <div className={"test"}>
                    <h3>Specify Content</h3>
                    {
                        this.props.openContent ?
                            <div style={specifyContentPadding}>
                                Import from drupal <CloudUploadIcon  />
                                <ul style={unorderedListStyle}>
                                    {this.props.languages.map(l =>{
                                        return <li style={unorderedListItemPadding} onClick={()=>this.props.templateSelect('anonymous', l)}><a href="javascript:void(0)">{l}</a></li>
                                    })}
                                </ul>
                                <FormControlLabel control={<Checkbox checked={this.state.checked} onChange={()=>{this.setState({checked:!this.state.checked})}} value="checkedB"/>} label="Specify pages for Customer/Presenter"/>
                                {
                                    this.state.checked ?
                                        <div>
                                            Customer Version<br />
                                            Import from drupal <CloudUploadIcon  />
                                            <ul style={unorderedListStyle}>
                                                {this.props.languages.map(l=>{
                                                    return <li style={unorderedListItemPadding} onClick={()=>this.props.templateSelect('customer', l)}><a href="javascript:void(0)">{l}</a></li>
                                                })}
                                            </ul>

                                            Presenter Version<br />
                                            Import from drupal <CloudUploadIcon  />
                                            <ul style={unorderedListStyle}>
                                                {this.props.languages.map(l=>{
                                                    return <li style={unorderedListItemPadding} onClick={()=>this.props.templateSelect('presenter', l)}><a href="javascript:void(0)">{l}</a></li>
                                                })}
                                            </ul>
                                        </div>
                                        : false

                                }
                                <Button variant="contained" color="primary" disabled={!this.props.saveContentButton} className={classes.button} onClick={()=>this.props.saveContent(this.props.templateApiInfo)}>
                                    Save Content
                                </Button>
                            </div>
                            : false
                    }
                </div>
            </div>
		];
	}
}
export default connect(state => ({
    auth: state.version.auth,
    locale: state.version.locale,
    market: state.market.id,
    openContent: state.version.openContent || false,
	versions: state.version.list,
    version: state.version.version,
    tabValue: state.version.tabValue,
    template: state.version.template,
    templateOptions: state.version.templateOptions,
    templateHTML: state.version.templateHTML,
    templateApiInfo: state.version.templateApiInfo,
    templates: state.version.templates,
    languages: state.market.languages,
    saveContentButton: state.version.saveContentButton || false
}), (dispatch, props) => ({
	versionSelect: (version) => {
        dispatch(changeVersion(version));
	},
    initialTemplate: (template,version, options) => {
        dispatch(initialTemplate(version, template, options));
    },
    templateSelect: (auth, locale) => {
        dispatch(changeTemplate(auth, locale));
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
    changeContent: (html, template)=>{
        dispatch(changeTemplateHtml(html, template));
    },
    saveContent: (templateApiInfo)=>{
        dispatch(saveAllContent(templateApiInfo));
    }
}))(withStyles(styles)(VersionTable));
