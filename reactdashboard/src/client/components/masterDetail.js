import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Segment, Grid, Header, Image, Button } from 'semantic-ui-react';
import Home from './home';

let masterDetailStyle = {
    'height': window.innerHeight
    //,'width': window.innerWidth * 0.8
}
export default class MasterDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'home'
        }
    }
    componentWillReceiveProps(nP) {
        this.setState({
            activeItem: nP.activeItem
        });
    }
    render() {
        let { activeItem, debtorData } = this.state;
        return (
            <div style={masterDetailStyle}>
                {activeItem == 'home' ? <Home {...this.props} /> : ''}
            </div>
        );
    }
}