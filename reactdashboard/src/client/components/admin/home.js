import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Message,Input,Label,Modal,Icon,Card,Segment,Grid,Header,Image,Button } from 'semantic-ui-react';
import {RECHARGE_LIST_COLUMN_COUNT} from '../../../config'
import FetchAPI from '../../apis'


class RechargeNotifCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            debtorData: this.props.debtorData.debtorUserData,
            log: this.props.debtorData.log
        }
    }
    componentWillReceiveProps = nP=>this.setState({debtorData:nP.debtorData.debtorUserData,log: nP.debtorData.log})
    render(){
        let { Debtor_strName, Debtor_curLimit, Debtor_strMailId,Debtor_curBalance, isRechargeRequested } = this.state.debtorData;
        let {rechargeAmount,approvalPending,timeStampApproved,userID} = this.state.log;
        return (
            <Card raised>
                <Card.Content>
                    <Card.Header>
                        {Debtor_strName}
                    </Card.Header>
                    <Card.Meta>
                        {Debtor_strMailId}
                    </Card.Meta>
                    <Card.Description>
                        Current Limit : {Debtor_curLimit.toLocaleString()}
                        <br />
                        Balance : {Debtor_curBalance.toLocaleString()}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    Recharge Amount : {rechargeAmount.toLocaleString()}
                    <br/>
                    <br/>
                    {approvalPending?<Button onClick={()=>{this.props.onAuthorizeClicked(userID)}} basic size="tiny" color='red'>Authorize Recharge</Button>:
                    `Approved At ${new Date(timeStampApproved)}`}
                </Card.Content>
            </Card>
        );
    }
}
export default class Home extends Component{
    constructor(props){
        super(props);
        this.state=this.getRechargeLists(this.props.debtorData.logs)
    }
    componentWillReceiveProps(nP){
        this.setState(this.getRechargeLists(nP.debtorData.logs));
    }
    getRechargeLists(logs){
        let rechargeList =[],previousRechargeList =[];
        logs.map((e,i)=>{
            let arr = e[Object.keys(e)[0]].logs.map((lE,lI)=>{
                    let debData={};
                    if(lE.approvalPending==false){
                        debData.debtorUserData=e[Object.keys(e)[0]].debtorUserData
                        debData.userID = e[Object.keys(e)[0]].userID;
                        debData.log =lE;
                        previousRechargeList.push(debData)
                    }else{
                        debData.debtorUserData=e[Object.keys(e)[0]].debtorUserData
                        debData.userID = e[Object.keys(e)[0]].userID;
                        debData.log =lE;
                        rechargeList.push(debData)
                    }
            })
        });
        return {rechargeList,previousRechargeList}
    }
    render(){
        let {rechargeList,previousRechargeList} = this.state;
        return (
                <div>
                    <Header as='h3'>
                        Recharges To be Approved
                    </Header>
                    <Card.Group itemsPerRow={RECHARGE_LIST_COLUMN_COUNT}>
                        <br/><br/>
                        {!rechargeList.length==0? rechargeList.map((e,i)=> <RechargeNotifCard onAuthorizeClicked={this.props.callbacks.onAuthorizeClicked}debtorData={e} key={i}/>) :<Message warning header='No requests yet!' />}
                    </Card.Group>
                    <Header as='h3'>
                        Previous Recharges
                    </Header>
                    <Card.Group itemsPerRow={RECHARGE_LIST_COLUMN_COUNT}>
                        <br/><br/>
                        {!previousRechargeList.length==0?previousRechargeList.map((e,i)=><RechargeNotifCard debtorData={e} key={i}/>):<Message warning header='None Approved till now' />}
                    </Card.Group>
                </div>
        );
    }
}