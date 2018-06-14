import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';

import {changeVersion, changeTemplate,changeTemplateOptions} from '../../ducks/versions.js';

class VersionTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
        console.log(this.props);
		return [
            <div className="view" key="view">
                <div>
                    <label>
                        Show Site Wrapper
                        <input type="checkbox" checked={this.props.templateOptions.showWrapper} />
                    </label>

                    <label>
                        Choose a Locale
                        <select value={this.props.templateOptions.locale} onChange={(e)=>this.props.templateSelect(this.props.template, this.props.version,Object.assign({}, this.props.templateOptions, {"locale":e.target.value}))}>
                            <option value="en_US">en_US</option>
                            <option value="it_IT">it_IT</option>
                        </select>
                    </label>

                    <label>
                        View as a 
                        <select value={this.props.templateOptions.auth} onChange={(e)=>this.props.templateSelect(this.props.template, this.props.version,Object.assign({}, this.props.templateOptions, {"auth":e.target.value}))} >
                            <option value="anonymous">Guest</option>
                            <option value="customer">Customer</option>
                            <option value="presenter">Presenter</option>
                        </select>
                    </label>
                </div>
                <iframe src={"data:text/html;charset=utf-8,"+encodeURI(this.props.templateHTML)}>

                </iframe>
            </div>,
            <div className="select" key="versions">
                <div>
                    <h3>Choose a Version</h3>
        			<table>
                        <thead>
                            <tr>
                                <th>Version</th>
                                <th>Scheduled Release Date</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {this.props.versions.map(v=>{
                                return <tr key={v.id} className={this.props.version.id==v.id?'selected':''} onClick={this.props.versionSelect.bind(null, v)}>
                                    <td>{v.id}</td>
                                    <td>{v.ts}</td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>Choose a template</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Template Id</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.templates.map(t=>{
                                return <tr key={t.id} className={this.props.template.id==t.id?'selected':''} onClick={this.props.templateSelect.bind(null, t, this.props.version,this.props.templateOptions)}>
                                    <td>{t.id}</td>
                                    <td>{t.v}</td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
		];
	}
}
export default connect(state => ({
	versions: state.version.list,
    version: state.version.version,
    template: state.version.template,
    templateOptions: state.version.templateOptions,
    templateHTML: state.version.templateHTML,
    templates: state.version.templates
}), (dispatch, props) => ({
	versionSelect: (version) => {
        dispatch(changeVersion(version));
	},
    templateSelect: (template,version, options) => {
        dispatch(changeTemplate(version, template, options));
    }
}))(VersionTable);
