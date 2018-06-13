import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';

import {changeVersion} from '../../ducks/versions.js';

class VersionTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
        console.log(this.props);
		return [
            <div key="versions">
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
            </div>,
            <div key="items">
                <h3>Matching Templates</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Template Id</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.templates.map(v=>{
                            return <tr key={v.id} className={this.props.version.id==v.id?'selected':''} onClick={this.props.versionSelect.bind(null, v)}>
                                <td>{v.id}</td>
                                <td>{v.ts}</td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
		];
	}
}
export default connect(state => ({
	versions: state.version.list,
    version: state.version.version,
    templates: state.version.templates
}), dispatch => ({
	versionSelect: (version) => {
        dispatch(changeVersion(version));
	}
}))(VersionTable);
