import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card,Segment,Grid,Header,Image,Button } from 'semantic-ui-react';
import Home from './home';
import ThirdPartyConfig from './thirdpartyConfig';

let masterDetailStyle={
    'height':window.innerHeight*0.8,
    'width':window.innerWidth*0.8
}
export default class MasterDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            activeItem:'home',
            debtorData : this.props.debtorData,
            thirdPartyConfig : this.props.thirdPartyConfig
        }
    }
    componentWillReceiveProps(nP){
        this.setState({
            activeItem : nP.activeItem,
            debtorData : nP.debtorData,
            thirdPartyConfig : nP.thirdPartyConfig
        });
    }
    render(){
        let {activeItem,debtorData,thirdPartyConfig} = this.state;
        return (
            <div style={masterDetailStyle}>
                {activeItem == 'home' ? <Home {...this.props} debtorData={debtorData}/>:''}
                {activeItem == 'thirdParty' ? <ThirdPartyConfig {...this.props}/>:''}
            {/* <Segment raised style={masterDetailStyle}>
                 {activeItem == 'home' ? <Home debtorData={debtorData}/>:''}
                </Segment> */}
            </div>
        );
    }
}