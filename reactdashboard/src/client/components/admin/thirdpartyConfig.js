import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Segment, Grid, Header, Image, Menu, Icon, Form, Button, Accordion } from 'semantic-ui-react';
import ReactJson from 'react-json-view'
import config from '../../../config';
import FetchAPI from '../../apis'
import jsonQuery from 'json-query';

let thirdpartyConfigStyle = {
    //'height': window.innerHeight * 0.8,
    'width': window.innerWidth * 0.8
}
function concatNameAndFilterID(name, filterID) {
    return name + ' : ' + filterID
}

class Level2Content extends Component {
    constructor(props) {
        super(props);
        this.state = { data: this.props.data }
    }
    componentWillReceiveProps(nP) {
        this.setState({ data: nP.data })
    }
    render() {
        return (
            <Card.Group itemsPerRow={2}>
                {this.props.data.map((e, i) =>
                    <Card raised key={i}>
                        <Card.Content extra>
                            <Card.Description>
                                {Object.keys(e)[0] + ' : ' + e[Object.keys(e)[0]]}
                                <br />
                                {Object.keys(e)[1] + ' : ' + e[Object.keys(e)[1]]}
                                <br />
                                {Object.keys(e)[2] + ' : ' + e[Object.keys(e)[2]]}
                            </Card.Description>
                            <br />
                            <ReactJson displayDataTypes={false} collapsed={true} src={e} />
                        </Card.Content>
                    </Card>
                )}
            </Card.Group>
        )
    }
}
class FilteredData extends Component {
    constructor(props) {
        super(props);
        this.state = { data: this.props.data }
    }

    componentWillReceiveProps(nP) {
        this.setState({ data: nP.data })
    }
    render() {
        return (
            <Accordion exclusive={false} defaultActiveIndex={0} panels={Object.keys(this.state.data).map((e, i) => {
                return { title: e, content: { content: <Level2Content data={this.state.data[e] || []} />, key: i } }
            })} styled />
        )
    }
}
class FilterBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    state = { venue: '', event: '', session: '', price: '', sessionarea: '', submittedVenue: '', submittedSession: '', submittedEvent: '', submittedPrice: '', submittedSessionArea: '' }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    clearFilters = () => {
        this.setState({ clearFilters: true, venue: '', event: '', session: '', price: '', sessionarea: '', submittedVenue: '', submittedSession: '', submittedEvent: '', submittedPrice: '', submittedSessionArea: '' });
        this.props.onFilterSubmit(null, true);
    }

    handleSubmit = () => {
        const { venue, event, session, price, sessionarea } = this.state
        let submittedValues = { submittedVenue: venue || '', submittedEvent: event || '', submittedSession: session || '', submittedPrice: price || '', submittedSessionArea: sessionarea || '' };
        this.setState(submittedValues);
        this.props.onFilterSubmit(submittedValues, false);
    }

    render() {
        const { venue, event, session, price, sessionarea,
            submittedVenue, submittedSession, submittedEvent, submittedPrice, submittedSessionArea } = this.state;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Input label='Venue' placeholder='Venue' name='venue' value={venue} onChange={this.handleChange} />
                        <Form.Input label='Event' placeholder='Event' name='event' value={event} onChange={this.handleChange} />
                        <Form.Input label='Session' placeholder='Session' name='session' value={session} onChange={this.handleChange} />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Input label='PriceGroup' placeholder='PriceGroup' name='price' value={price} onChange={this.handleChange} />
                        <Form.Input label='SessionArea' placeholder='SessionArea' name='sessionarea' value={sessionarea} onChange={this.handleChange} />
                    </Form.Group>
                    <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
                </Form>
                <br />
                <Button onClick={this.clearFilters}>Clear Filters</Button>
            </div>
        )
    }
}
export default class ThirdPartyConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: concatNameAndFilterID(this.props.thirdPartyConfig[0].Debtor_strName, this.props.thirdPartyConfig[0].TK_strFilterID),
            activeItemData: this.props.thirdPartyConfig[0],
            feed: {},
            filteredFeed: {},
            clearFilters: false
        }
    }
    handleItemClick = (e, { name }) => {
        let activeItemData = this.props.thirdPartyConfig.filter((e, i) => {
            return (e.Debtor_strName === name.split(':')[0].trim() && e.TK_strFilterID === name.split(':')[1].trim())
        })[0];
        this.setState({
            activeItem: name,
            activeItemData,
            feed: {},
            filteredFeed: {},
            clearFilters: false
        })
        this.getThirdPartyFeed(activeItemData)
    }
    componentWillReceiveProps(nP) {
        this.setState({
            activeItem: concatNameAndFilterID(nP.thirdPartyConfig[0].Debtor_strName, nP.thirdPartyConfig[0].TK_strFilterID),
            activeItemData: nP.thirdPartyConfig[0]
        });
    }
    componentDidMount() {
        this.getThirdPartyFeed(this.state.activeItemData)
    }
    getThirdPartyFeed(activeItemData) {
        FetchAPI
            .get(
                config.serverAuthority + config.PATH_GET_THIRDPARTY_FEED + `/${activeItemData.consumer_username}`
                , {}
                , (err, d) => {
                    if (!err) {
                        if (!d.ok) this.setState({ feed: {}, feedError: d.error, filteredFeed: {} })
                        else this.setState({ feed: d.BookMyShow, feedError: null, filteredFeed: d.BookMyShow })
                    }
                    else this.setState({ feedError: err })
                }
            );
    }
    onFilterSubmit = (filterData, clearFilters) => {
        let filteredFeed;
        if (!clearFilters) {
            let { submittedVenue, submittedSession, submittedEvent, submittedPrice, submittedSessionArea } = filterData;
            filteredFeed = {
                "Event": jsonQuery(
                    `.Event[${!(submittedEvent === '') ? `*Event_strCode=${submittedEvent}` : ''}]`, {
                        data: this.state.feed
                    }).value,
                "Venue": jsonQuery(
                    `.Venue[${!(submittedVenue === '') ? `*Venue_strCode=${submittedVenue}` : ''}]`, {
                        data: this.state.feed
                    }).value,
                "Session": jsonQuery(`.Session[${!(submittedVenue === '') ? `*Venue_strCode=${submittedVenue}` : ''} ${!(submittedEvent === '') ? `& Event_strCode=${submittedEvent}` : ''} ${!(submittedSession === '') ? `& Session_lngSessionId=${submittedSession}` : ''}]`, {
                    data: this.state.feed
                }).value,
                "Price": jsonQuery(`.Price[${!(submittedVenue === '') ? `*Venue_strCode=${submittedVenue}` : ''} ${!(submittedPrice === '') ? `& PGroup_strCode=${submittedPrice}` : ''} ${!(submittedSessionArea === '') ? `& AreaCat_strCode=${submittedSessionArea}` : ''}]`, {
                    data: this.state.feed
                }).value,
                "SessionArea": jsonQuery(`.SessionArea[${!(submittedVenue === '') ? `*Venue_strCode=${submittedVenue}` : ''} ${!(submittedSessionArea === '') ? `& AreaCat_strCode=${submittedSessionArea}` : ''} ${!(submittedSession === '') ? `& Session_lngSessionId=${submittedSession}` : ''}]`, {
                    data: this.state.feed
                }).value
            }
        } else {
            filteredFeed = this.state.feed;
        }
        this.setState({ filteredFeed: filteredFeed, clearFilters: clearFilters });
    }
    render() {
        let { activeItem, activeItemData, feed, clearFilters, filteredFeed } = this.state;
        let dFeed = clearFilters ? feed : filteredFeed;
        return (
            <div>
                <Menu pointing widths={this.props.thirdPartyConfig.length}>
                    {this.props.thirdPartyConfig.map((e, i) =>
                        <Menu.Item key={i} name={concatNameAndFilterID(e.Debtor_strName, e.TK_strFilterID)} active={activeItem === concatNameAndFilterID(e.Debtor_strName, e.TK_strFilterID)} onClick={this.handleItemClick} >
                            <Header as='h4'>{concatNameAndFilterID(e.Debtor_strName, e.TK_strFilterID)}</Header>
                        </Menu.Item>
                    )}
                </Menu>
                <div style={thirdpartyConfigStyle}>
                    <Grid centered columns={2}>
                        <Grid.Row centered columns={1}>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row centered columns={1}>
                            <Grid.Column>
                                <Card.Group centered itemsPerRow={2}>
                                    <Card fluid>
                                        <Card.Content>
                                            <Card.Header>
                                                Filters
                                            </Card.Header>
                                            <br />
                                            <ReactJson displayDataTypes={false} collapsed={false} src={activeItemData.filterData} />
                                        </Card.Content>
                                    </Card>
                                    <Card fluid>
                                        <Card.Content>
                                            <Card.Header>
                                                Feed
                                            </Card.Header>
                                            <br />
                                            <FilterBox onFilterSubmit={this.onFilterSubmit} />
                                            <br />
                                            {/* <ReactJson displayDataTypes={false} collapsed={true} src={dFeed} /> */}
                                            <FilteredData data={dFeed} />
                                        </Card.Content>
                                    </Card>
                                </Card.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}