import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Segment, Grid, Header, Image } from 'semantic-ui-react';
import MasterDetail from './masterDetail';
import AdminMasterDetail from './admin/masterDetail';
import Sidebar from './sideBar';
import AdminSidebar from './admin/sideBar';

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'home'
        }
    }
    handleSideBarEvent = (e, name) => this.setState({ activeItem: name })
    componentWillReceiveProps(nP) {
        this.setState({});
    }
    render() {
        let { activeItem } = this.state;
        return (
            <Grid>
                <Grid.Column width={3}>
                    <Sidebar {...this.props} emitSideBarEvent={this.handleSideBarEvent} />
                </Grid.Column>
                <Grid.Column width={13}>
                    <MasterDetail {...this.props} activeItem={activeItem} />
                </Grid.Column>>
            </Grid>
        )
    }
}