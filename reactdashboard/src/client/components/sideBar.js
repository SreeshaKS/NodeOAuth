import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Segment, Grid, Header, Image, Menu, Icon, Accordion } from 'semantic-ui-react';

let imageURL = 'http://is1.mzstatic.com/image/pf/us/r30/Purple1/v4/47/cc/27/47cc27d6-9d1d-2ac8-2fde-79c8c6cc519a/mzl.zntzicdu.png';
let sidebarStyle = {
    'height': window.innerHeight
    //,'width': window.innerWidth * 0.1
}

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: 'home', activeIndex: 1 }
    }
    handleItemClick = (e, { name }) => { this.setState({ activeItem: name }); this.props.emitSideBarEvent(e, name); }
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }
    render() {
        const { activeItem, activeIndex } = this.state
        return (
            <Segment raised style={sidebarStyle}>
                <Grid centered columns={1} celled='internally'>
                    <Grid.Row>
                        <Header as='h2' icon>
                            <Icon name='money' />
                            My Wallet
                        <Header.Subheader>
                                OAuth2.0 Protected Wallet
                        </Header.Subheader>
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Accordion >
                            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                <Header size='medium'>
                                    <Icon name='user' size='tiny'/>
                                    <Header.Content>
                                        Sreesha
                                    </Header.Content>
                                </Header>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                <p>
                                    Email
                                </p>
                                <p>
                                    Text
                                </p>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column >
                            <Menu stackable secondary fluid vertical >
                                <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
                                    Home<Icon name='home' />
                                </Menu.Item>
                            </Menu>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}