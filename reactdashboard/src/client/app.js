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
        let authCookie = getCookie('auth', document.cookie)
        let errCookie = getCookie('authErr', document.cookie)
        let isLoggedIn = false
        if (authCookie && !errCookie) isLoggedIn = true
        console.log('LoggedIn', authCookie, !errCookie, errCookie, authCookie && !errCookie ? true : false);
        this.state = {
            authCookie: authCookie,
            errCookie: errCookie,
            isLoggedIn: isLoggedIn
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
                        console.log(d)
                        var wind = window.open("", "popupWindow", "width=600,height=600,scrollbars=yes");
                        wind.document.write(d);
                        // this.setState({ transData: d })
                        // successCallback(d ? true : false, d)
                    }, {
                        //'content-type': 'application/json',
                        // 'Authorization': 'Basic ' + base64.encode(data.name + ":" + data.pass)
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
        getMoney: (dataCallback) => {
            FetchAPI
                .get(
                    `http://localhost:3000/api/money`
                    , {}
                    , (e, d) => {
                        this.setState({ transaction: d })
                        dataCallback(d)
                        console.log('MoneyData', d)
                    }, {
                        'Authorization': 'Bearer ' + this.state.authCookie.access_token.value
                    });
        },
        addMoney: (money, callback) => {
            FetchAPI
                .post(
                    `http://localhost:3000/api/money`
                    , {
                        name: 'testMoney',
                        type: 'euro',
                        quantity: money
                    }
                    , (e, d) => {
                        console.log('AddMoney', d)
                        callback(d)
                    }, {
                        'Authorization': 'Bearer ' + this.state.authCookie.access_token.value
                        , 'content-type': 'application/json'
                    });
        },
        sendmoney: () => {
            FetchAPI
                .post(
                    `http://localhost:3000/api/money`
                    , {
                        name: 'testMoney',
                        type: 'euro',
                        quantity: money
                    }
                    , (e, d) => {
                        console.log('AddMoney', d)
                        callback(d)
                    }, {
                        'Authorization': 'Bearer ' + this.state.authCookie.access_token.value
                        , 'content-type': 'application/json'
                    });
        }
    }
    componentDidMount() {
    }
    render() {
        let { isLoggedIn, authCookie, errCookie } = this.state;
        return (
            <div>
                {isLoggedIn ?
                    <Grid centered fluid columns={1}>
                        {/* <Grid.Row centered>
                            <AppHeader callbacks={this.callbacks} />
                        </Grid.Row> */}
                        <Grid.Row centered columns={2}>
                            {console.log(document.URL)}
                            <MainPage isLoggedIn={isLoggedIn} callbacks={this.callbacks} />
                        </Grid.Row>
                    </Grid> :
                    <LoginModal callbacks={this.callbacks} open={!isLoggedIn} />}
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('app')
);