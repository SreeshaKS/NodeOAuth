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
import { CookiesProvider } from 'react-cookie';
import { getCookie } from './utils';
import { clientID, redirect_uri } from '../config/secret'

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
        console.log('constructor', getCookie('auth', document.cookie))
        this.state = {
            authCookie: getCookie('auth', document.cookie),
            errCookie: getCookie('authErr', document.cookie),
            isLoggedIn: false
        };
    }
    setInitalState = (data) => {
        this.setState({
            transData: { user: { username: '' }, client: { name: '' } }
            , isLoggedIn: true
        });
    }
    callbacks = {
        onLogIn: (data, successCallback) => {
            FetchAPI
                .get(
                    `http://localhost:3000/api/oauth2/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirect_uri}`
                    , {}
                    , (e, d) => {
                        this.setState({ transData: d })
                        successCallback(d ? true : false, d)
                    }, {
                        //'content-type': 'application/json',
                        'Authorization': 'Basic ' + base64.encode(data.name + ":" + data.pass)
                    });
        },
        onLogOut: () => {

        },
        shouldAllow: (name, pass, shouldAllow) => {
            let data = { transaction_id: this.state.transData.transactionID }
            if (!shouldAllow) data.cancel = 'Deny'
            FetchAPI
                .post(
                    `http://localhost:3000/api/oauth2/authorize`//?client_id=${clientID}&response_type=code&redirect_uri=http://localhost:3000`
                    , data
                    , (e, d) => {
                        console.log(d)
                    }, {
                        //'Content-Type': 'application/json'//'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + base64.encode(name + ":" + pass)
                    });
        },
        addMoney: () => {

        },
        sendmoney: () => {

        }
    }
    componentDidMount() {
    }
    render() {
        let { isLoggedIn, authCookie, errCookie } = this.state;
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
                <LoginModal callbacks={this.callbacks} open={!(authCookie && !errCookie)} />
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('app')
);