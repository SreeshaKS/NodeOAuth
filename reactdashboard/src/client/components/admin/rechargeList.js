import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Segment,Grid,Header,Image } from 'semantic-ui-react';
import MasterDetail from './masterDetail';
import Sidebar from './sideBar';

export default class MainPage extends Component{
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(nP){
        
    }
    render(){
        let {activeItem}= this.state;
        return (
            <Grid centered padded>
                <Grid.Column width={2}>
                    <Sidebar {...this.props} emitSideBarEvent={this.handleSideBarEvent}/>
                </Grid.Column>
                <Grid.Column width={13}>
                    <MasterDetail {...this.props} activeItem={activeItem}/>
                </Grid.Column>
            </Grid>
        );
    }
}