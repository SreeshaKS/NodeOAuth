import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Message, Input, Label, Modal, Icon, Card, Segment, Grid, Header, Image, Button } from 'semantic-ui-react';
import config from '../../config'
import FetchAPI from '../apis'
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { addmoney: '', sendmoney: '', submittedadd: '', submittedsend: '', graphData: null }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = () => {
        const { addmoney, sendmoney } = this.state
        this.setState({ submittedadd: addmoney, submittedsend: sendmoney })
        if (addmoney) {
            this.props.callbacks.addMoney(addmoney, () => {
                this.getMoney()
            })
        } else {

        }
    }
    componentWillReceiveProps(nP) {
        this.setState({
        });
    }
    getMoney() {
        this.props.callbacks.getMoney((gData) => {
            console.log('Got Money')
            this.setState({ graphData: gData.map((e, i) => { return { amt: 2400, name: e.date.split('T')[0], pv: parseInt(e.quantity), uv: 4000 } }) })
        })
    }
    componentDidMount() {
        this.getMoney()
    }
    render() {
        let sum = 0;
        (this.state.graphData || []).forEach((e, i) => {
            sum = sum + e.pv
        })
        return (
            <Grid columns='equal' centered columns={2}>
                <Grid.Row stretched>
                    <ResponsiveContainer width="100%" aspect={4}>
                        <AreaChart data={this.state.graphData || data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis tickLine={false} axisLine={false} hide={false} dataKey="name" />
                            <YAxis hide={false} axisLine={false} />
                            <Tooltip />
                            {/* <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" /> */}
                            <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Grid.Row>
                <Grid.Row stretched >
                    <Grid columns={3} divided centered columns='equal' padded>
                        <Grid.Row centered stretched>
                            <Grid.Column>
                                <Header size='huge' icon>
                                    <Icon name='sign out' color='red' size='massive' />
                                    $500
                                </Header>
                            </Grid.Column>
                            <Grid.Column>
                                <Header size='huge' icon>
                                    <Icon name='money' size='massive' color='green' />
                                    ${sum}
                                </Header>
                            </Grid.Column>
                            <Grid.Column>
                                <Header size='huge' icon>
                                    <Icon name='sign in' size='massive' />
                                    $0
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row centered stretched>
                            {/* <Grid.Column verticalAlign='center'>
                                <Form onSubmit={this.handleSubmit} size='huge'>
                                    <Form.Group >
                                        <Form.Input placeholder='Send Money' name='sendmoney' onChange={this.handleChange} />
                                        <br />
                                        <Form.Button type='submit' icon color='red' circular size='large'>
                                            <Icon name='sign out' color='white' size='large' />
                                        </Form.Button >
                                    </Form.Group>
                                </Form>
                            </Grid.Column> */}
                            <Grid.Column verticalAlign='middle'>
                                <Form onSubmit={this.handleSubmit} size='huge'>
                                    <Form.Group>
                                        <Form.Input placeholder='Add Money' name='addmoney' onChange={this.handleChange} />
                                        <br />
                                        <Form.Button circular type='submit' icon color='blue' size='large'>
                                            <Icon name='sign in' color='white' size='large' />
                                        </Form.Button >
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid>
        );
    }
}


const data = [
    {
        amt: 2400,
        name: "Page A",
        pv: 2400,
        uv: 4000
    },
    {
        amt: 2210,
        name: "Page B",
        pv: 1398,
        uv: 3000
    },
    {
        amt: 2290,
        name: "Page C",
        pv: 9800,
        uv: 2000
    },
    {
        amt: 2000,
        name: "Page D",
        pv: 3908,
        uv: 2780
    }, {
        amt: 2181,
        name: "Page E",
        pv: 4800,
        uv: 1890
    }, {
        amt: 2500,
        name: "Page F",
        pv: 3800,
        uv: 2390
    }, {
        amt: 2100,
        name: "Page G",
        pv: 4300,
        uv: 3490
    }
];