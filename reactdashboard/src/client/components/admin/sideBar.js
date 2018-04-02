import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Segment,Grid,Header,Image ,Menu,Icon} from 'semantic-ui-react';

let imageURL = 'http://is1.mzstatic.com/image/pf/us/r30/Purple1/v4/47/cc/27/47cc27d6-9d1d-2ac8-2fde-79c8c6cc519a/mzl.zntzicdu.png';
let sidebarStyle={
    'height':window.innerHeight*0.9,
    'width':window.innerWidth*0.1
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class SideBar extends Component{
    constructor(props){
        super(props);
        this.state = { activeItem: 'home' }
    }
    handleItemClick = (e, { name }) => {this.setState({ activeItem: name });this.props.emitSideBarEvent(e,name);}
    render(){
        const { activeItem } = this.state;
        console.log('Sidebar Items',this.props.items);
        return (
            <Segment raised style={sidebarStyle}>
                <Grid centered columns={1} celled='internally'>
                    <Grid.Row>
                        <Header size='huge'>
                            <Image circular src={imageURL} />
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column >
                            <Menu stackable secondary fluid vertical >
                                {this.props.items.map((e,i)=>
                                    <Menu.Item key={i} name={e.itemName} active={activeItem === e.itemName} onClick={this.handleItemClick}>
                                        {capitalizeFirstLetter(e.itemName)}<Icon color='blue' name={e.itemIcon} />
                                    </Menu.Item>
                                )}
                            </Menu>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}