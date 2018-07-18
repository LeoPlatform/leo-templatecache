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
import ImportDrupal from './importDrupalDialog.jsx';

import moment from 'moment';

import {changeVersion, changeTemplate, createRelease, showDialog, showContentDialog, changeTemplateHtml, initialTemplate, saveAllContent, specifyContentCheckBox, textAreaChanged, showImportDialog} from '../../ducks/versions.js';

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
        let anchorStyle = {textDecoration: 'none'};
        let cloudIconStyle = {left: '5px', position: 'relative'};
        $('#htmlTextArea').val(this.props.templateHTML);
        let templateId = this.props.template && this.props.template.id;
        let disableSave = (this.props.changed && Object.keys(this.props.changed).length !== 0) && this.props.saveContentButton;
        
		return [
            <div className="view" key="view">
                <AppBar className="appBar" position="static">
                    <Tabs value={value} onChange={(event, value)=> {this.setState({ value })}}>
                        <Tab label="Preview" />
                        <Tab label="Code" />
                    </Tabs>
                </AppBar>
                {value === 0 && <iframe src={"data:text/html;charset=utf-8,"+encodeURI(this.props.wrappedHTML || '')}></iframe>}
                {
                    value === 1 &&
                    <div style={{width: '100%', height: '100%'}}>
                        <textarea id="htmlTextArea" style={{width: '99%', height: '92%'}}>{this.props.templateHTML}</textarea>
                        <div style={{width:'100%', boxSizing:'border-box', height:'8%',padding:'5px'}}>
                            <Button variant="contained" color="primary" className={classes.button} onClick={()=>this.props.changeContent($('#htmlTextArea').val(), this.props.languages)}>
                                Change Content
                            </Button>
                        </div>
                    </div>
                }
            </div>,
            <div className="select" key="versions">
                <div style={{overflow:'auto'}}>
                    <h3>Choose a Release</h3>
                    <Button variant="contained" color="primary" className={classes.button} onClick={()=>this.props.showDialog()}>
                      Create a Release
                    </Button>                
                    <CreateVersion></CreateVersion>
                    <ImportDrupal></ImportDrupal>
                    <MenuList id="versionlist" component="div">
                     {this.props.versions && this.props.versions.map((v,i)=>{
                      let isSelected = v.id === this.props.version.id;
                         return [i==0?null:<Divider />,
                         <MenuItem button selected={isSelected} style={listItemOverrides} onClick={()=>this.props.versionSelect(v, this.props.market)}>
                            <ListItemText  classes={{ primary: classes.primary, secondary: classes.primary }} primary={moment(v.id).format('LLLL')} secondary={v.name}/>
                         </MenuItem>]
                    })}
                    </MenuList>
                </div>
                <div>
                    <h3>Choose a Path</h3>
                    <MenuList id="versionlist" component="div" >
                     {this.props.templates && this.props.templates.map((t,i)=>{
                         let isSelected = t.id === this.props.template.id && this.props.openContent;
                         return [i==0?null:<Divider />,
                         <MenuItem button selected={isSelected} style={listItemOverrides} onClick={()=>this.props.initialTemplate(t, this.props.version,this.props.market, this.props.languages, this.props.wrapperMap, templateId)}>
                             <ListItemText  classes={{ primary: classes.primary, secondary: classes.primary }} primary={t.id} secondary={t.v===null?'Unchanged':''}/>
                             <CloudUploadIcon style={cloudIconStyle} onClick={()=>this.props.showImportDialog()}/>
                         </MenuItem>]
                    })}
                    </MenuList>
                </div>
                <div className={"test"}>
                    <h3>Specify Content</h3>
                    {
                        this.props.openContent ?
                            <div style={specifyContentPadding}>
                                <ul style={unorderedListStyle}>
                                    {this.props.languages && this.props.languages.map(l =>{
                                        let itemContent = this.props.templateApiInfo && this.props.templateApiInfo['anonymous'] && this.props.templateApiInfo['anonymous'][l];
                                        var isChanged = false;
                                        anchorStyle = {textDecoration: 'none'};
                                        if (itemContent === undefined) {
                                            anchorStyle = {color:'gray', textDecoration: 'none'};
                                        }
                                        if (this.props.changed && this.props.changed['anonymous'] && this.props.changed['anonymous'].indexOf(l) !== -1) {
                                            isChanged = true
                                        }
                                        let text = isChanged ? `*${l}`: l;
                                        if (this.props.auth === 'anonymous' && this.props.locale === l) {
                                            text = <b>{text}</b>;
                                        }
                                        return <li style={unorderedListItemPadding} onClick={()=>this.props.templateSelect('anonymous', l, this.props.wrapperMap, templateId)}><a style={anchorStyle} href="javascript:void(0)">{text}</a></li>
                                    })}
                                </ul>
                                <FormControlLabel control={<Checkbox checked={this.props.checkboxCheck === true ? true : false} onChange={()=>{this.props.changeCheckbox(this.props.checkboxCheck)}} value="checkedB"/>} label="More Content"/>
                                {
                                    this.props.checkboxCheck ?
                                        <div>
                                            <b>Customer Version</b><br />
                                            <ul style={unorderedListStyle}>
                                                {this.props.languages && this.props.languages.map(l=>{
                                                    let itemContent = this.props.templateApiInfo && this.props.templateApiInfo['customer'] && this.props.templateApiInfo['customer'][l];
                                                    var isChanged = false;
                                                    anchorStyle = {textDecoration: 'none'};
                                                    if (itemContent === undefined) {
                                                        anchorStyle = {color:'gray', textDecoration: 'none'};
                                                    }
                                                    if (this.props.changed && this.props.changed['customer'] && this.props.changed['customer'].indexOf(l) !== -1) {
                                                        isChanged = true
                                                    }
                                                    let text = isChanged ? `*${l}`: l;
                                                    if (this.props.auth === 'customer' && this.props.locale === l) {
                                                        text = <b>{text}</b>;
                                                    }
                                                    return <li style={unorderedListItemPadding} onClick={()=>this.props.templateSelect('customer', l, this.props.wrapperMap, templateId)}><a style={anchorStyle} href="javascript:void(0)">{text}</a></li>
                                                })}
                                            </ul>

                                            <b>Presenter Version</b><br />
                                            <ul style={unorderedListStyle}>
                                                {this.props.languages && this.props.languages.map(l=>{
                                                    let itemContent = this.props.templateApiInfo && this.props.templateApiInfo['presenter'] && this.props.templateApiInfo['presenter'][l];
                                                    var isChanged = false;
                                                    anchorStyle = {textDecoration: 'none'};
                                                    if (itemContent === undefined) {
                                                        anchorStyle = {color:'gray', textDecoration: 'none'};
                                                    }
                                                    if (this.props.changed && this.props.changed['presenter'] && this.props.changed['presenter'].indexOf(l) !== -1) {
                                                        isChanged = true
                                                    }
                                                    let text = isChanged ? `*${l}`: l;
                                                    if (this.props.auth === 'presenter' && this.props.locale === l) {
                                                        text = <b>{text}</b>;
                                                    }
                                                    return <li style={unorderedListItemPadding} onClick={()=>this.props.templateSelect('presenter', l, this.props.wrapperMap, templateId)}><a style={anchorStyle} href="javascript:void(0)">{text}</a></li>
                                                })}
                                            </ul>
                                        </div>
                                        : false

                                }
                                <Button variant="contained" color="primary" disabled={!disableSave} className={classes.button} onClick={()=>this.props.saveContent(this.props.market, this.props.version.id, this.props.template.id, this.props.templateApiInfo)}>
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
    checkboxCheck: state.version.checkboxCheck,
    changed: state.version.changed,
    codeChanged: state.version.codeChanged,
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
    saveContentButton: state.version.saveContentButton || false,
    wrapperFiles: state.version.wrapperFiles,
    wrapperMap: state.version.wrapperMap,
    wrappedHTML: state.version.wrappedHTML
}), (dispatch, props) => ({
	versionSelect: (version, market) => {
        dispatch(changeVersion(version, market));
	},
    initialTemplate: (template,version, options, languages, wrapperMap, templateId) => {
        dispatch(initialTemplate(version, template, options, languages, wrapperMap, templateId));
    },
    templateSelect: (auth, locale, wrapperMap, templateId) => {
        dispatch(changeTemplate(auth, locale, wrapperMap, templateId));
    },
    createRelease: ()=>{
      dispatch(createRelease("Another test", Date.now()));
    },
    changeCheckbox: (checkboxCheck)=>{
        dispatch(specifyContentCheckBox(checkboxCheck));
    },
    showDialog: ()=>{
      dispatch(showDialog());
    },
    showContentDialog: ()=>{
      dispatch(showContentDialog());
    },
    changeContent: (html, languages)=>{
        dispatch(changeTemplateHtml(html, languages));
    },
    saveContent: (market, version, template,  templateApiInfo)=>{
        dispatch(saveAllContent(market, version, template, templateApiInfo));
    },
    textAreaChanged: ()=>{
        dispatch(textAreaChanged());
    },
    showImportDialog: () =>{
        dispatch(showImportDialog());
    }
}))(withStyles(styles)(VersionTable));