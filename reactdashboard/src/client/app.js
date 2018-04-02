import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Container, Segment, Icon, Header } from 'semantic-ui-react';
import AppHeader from './components/header';
import MainPage from './components/mainPage';
import LoginPrompt from './components/loginPromt';
import FetchAPI from './apis';
import config from '../config';
import LoginModal from './components/loginModal';
import base64 from 'base-64';

let loginPromptStyle = {
    'height': window.innerHeight * 0.2,
    'width': window.innerWidth * 0.2
}

let items = [
    {
        itemName: 'home',
        itemID: 'home',
        itemIcon: 'home'
    },
    {
        itemName: 'thirdParty',
        itemID: 'thirdParty',
        itemIcon: 'users'
    }
];

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }
    setInitalState = (data) => {
        this.setState({
            transData: { user: { username: '' }, client: { name: '' } }
            , isLoggedIn: true
        });
    }
    callbacks = {
        onLogIn: (data, successCallback) => {
            let clientID = '1234';
            FetchAPI
                .get(
                    `http://localhost:3000/api/oauth2/authorize?client_id=${clientID}&response_type=code&redirect_uri=http://localhost:8181`
                    , {}
                    , (e, d) => {
                        this.setState({ transData: d })
                        console.log(d)
                        successCallback(d ? true : false, d)
                    }, {
                        //'content-type': 'application/json',
                        'Authorization': 'Basic ' + base64.encode(data.name + ":" + data.pass)
                    });
        },
        onLogOut: () => { },
        shouldAllow: shouldAllow => {
            console.log('Should Allow?', shouldAllow,this.state)
            let data = { transaction_id: this.state.transData.transactionID }
            if (!shouldAllow) data.cancel = 'Deny'
            FetchAPI
                .post(
                    `http://localhost:3000/api/oauth2/authorize`//?client_id=${clientID}&response_type=code&redirect_uri=http://localhost:3000`
                    , data
                    , (e, d) => {
                        console.log(d)
                    }, {
                        // 'Content-Type': 'application/json'//'application/x-www-form-urlencoded'
                        //'Authorization': 'Basic ' + base64.encode(data.name + ":" + data.pass)
                    });
        }
    }
    componentDidMount() {
    }
    render() {
        let { isLoggedIn } = this.state;
        return (
            <div>
                <Grid centered fluid columns={1}>
                    {/* <Grid.Row centered>
                            <AppHeader callbacks={this.callbacks} />
                        </Grid.Row> */}
                    <Grid.Row centered columns={2}>
                        {console.log(document.URL)}
                        <MainPage />
                    </Grid.Row>
                </Grid>
                <LoginModal callbacks={this.callbacks} open={true} />
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('app')
);