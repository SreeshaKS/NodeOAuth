import React, { Component } from 'react'
import { Button, Icon, Modal, Form } from 'semantic-ui-react'

class NestedModal extends Component {
    state = { open: false, transData: { user: { username: '' }, client: { name: '' } } }

    open = () => this.setState({ open: true })
    deny = () => { this.setState({ open: false }); this.props.allow(false) }
    allow = () => { this.setState({ open: false }); this.props.allow(true) }
    componentWillReceiveProps(nP) {
        this.setState({ transData: nP.transData })
    }
    render() {
        const { open, transData } = this.state;
        const { user, client } = transData || { user: { username: '' }, client: { name: '' } };
        return (
            <Modal
                dimmer={false}
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size='small'
                trigger={<Button disabled={false} primary icon onClick={this.props.onSubmit}>Login And Proceed <Icon name='right chevron' /></Button>}
            >
                <Modal.Header>Do you approve ?</Modal.Header>
                <Modal.Content>
                    <p>{user ? user.username : ''} {client ? client.name : ''} </p>

                    <form action="http://localhost:3000/api/oauth2/authorize" method="post">
                        <input name="transaction_id" type="hidden" value={transData.transactionID} />
                        <input type="submit" value="Allow" id="allow" />
                        <input type="submit" value="Deny" name="cancel" id="deny" />
                    </form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" content='Allow' onClick={this.allow} />
                    <Button color="red" content='Deny' onClick={this.deny} />
                </Modal.Actions>
            </Modal>
        )
    }
}

class LoginModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: this.props.open,
            name: null,
            pass: null,
            submittedName: null,
            submittedPass: null,
            isLoggedIn: false,
            transData: {}
        }
    }
    componentWillReceiveProps(nP) {
        this.setState({ open: nP.open })
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = () => {
        const { name, pass } = this.state

        this.setState({ submittedName: name, submittedPass: pass, isLoggedIn: true })
        this.props.callbacks
            .onLogIn(
                { name, pass },
                (isLoginSuccessFull, data) => {
                    this.setState({ isLoggedIn: isLoginSuccessFull, transData: data })
                }
            )
    }
    render() {
        let { open, name, pass, submittedName, submittedPass, isLoggedIn, transData } = this.state;
        console.log(this.state)
        return (
            <Modal open={open} trigger={<Button>Login</Button>}>
                <Modal.Header>Login</Modal.Header>
                <Modal.Content >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Input placeholder='UserName' name='name' value={name} onChange={this.handleChange} />
                            <Form.Input placeholder='Password' name='pass' value={pass} onChange={this.handleChange} type='password' />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions >
                    <NestedModal shouldDisplay={submittedName && submittedPass ? true : false} onSubmit={this.handleSubmit} transData={transData} allow={s => this.props.callbacks.shouldAllow(submittedName, submittedPass, s)} />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default LoginModal