import React, { Component } from 'react'  
import Button from '@material-ui/core/Button';     
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';  
import { Container, Col, Row  } from 'react-bootstrap'   
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';  
import axios from 'axios'; 
import { Alert, AlertTitle } from '@material-ui/lab';  


export default class DeleteUsers extends Component {
 
    state = {  
      users: [], 
      API_err: false,
      selectedUsers: [],
      loading: false,
      apiSucceeded: false
    }  

 
    componentDidMount(){
         
        this.getData()
    }

    // FETCH USERS FROM DATABASE
    getData = async () => {
        try{

        const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
        if(token){ 
        await axios
            .get("/api/address", { headers: { 'x-auth-token': token  } })
            .then(res => {
            if(res.status === 200){ 
                this.setState({loading: false, users: res.data })
            }else{
                this.setState({API_err: true, loading: false })
            }
            })
            .catch(e =>{
            console.log(e.message) 
            localStorage.setItem('UQMpWKN1JxSAATzETMO3', JSON.stringify('')) 
            window.location = '/auth'  
        })
        }else{
        localStorage.setItem('UQMpWKN1JxSAATzETMO3', JSON.stringify('')) 
        window.location = '/auth'
        }

        }catch(e){ 
        this.setState({API_err: true})
        }
    }

    
    userColumns=[
        {
            dataField: 'Address',
            text: 'Address'
        },
        {
            dataField: 'Reward',
            text: 'Reward'
        },
        {
            dataField: 'Airdrop',
            text: 'Airdrop'
        },
        {
            dataField: 'Status',
            text: 'Status'
        },
        {
            dataField: 'CreateDate',
            text: 'CreateDate'
        } 
        
    ]

    handleProfileRowSelect = {
        mode: 'checkbox',
        clickToSelect: true,
        hideSelectAll: false,
        
        onSelect: (row, isSelect, rowIndex, e) => {
            if(isSelect){
                const arr = [...this.state.selectedUsers]
                arr.push(row._id)
                this.setState({ selectedUsers: arr })
                
            }else{ 
                const arr = [...this.state.selectedUsers]
                const newArr = arr.filter(id => id !== row._id) 
                this.setState({selectedUsers: newArr}) 
            }
        },
        onSelectAll: (isSelect,row, rowIndex, e) => {
           console.log('row:', row)
            if(isSelect){ 
                let arr = []
                for(let i of row){
                    arr.push(i._id)
                }
              this.setState({ selectedUsers: arr })
              
            }else{ 
              this.setState({selectedUsers:  []})
              
            }
        }
    } 



    handleDeleteUsers = async () => {
        try{
            
            this.setState({loading: true})
            const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
            await axios
            .post('/api/address/delete',{ ids: this.state.selectedUsers },{ headers: { 'x-auth-token': token } })
            .then(async(res) => {
                console.log('res',res)
               if(res.status === 200){
                   if(res.data.success){ 
                        this.setState({  loading: false,  apiSucceeded: true })
                   }else{
                       this.setState({API_err: true})
                   }
              
               }else{
                  localStorage.setItem('UQMpWKN1JxSAATzETMO3', JSON.stringify('')) 
                  window.location = '/auth'  
               }
            })
 
        }catch(e){
            console.log(e)
            localStorage.setItem('UQMpWKN1JxSAATzETMO3', JSON.stringify('')) 
            window.location = '/auth'  
        }
    }
 
   render() {
    return ( 
    <div> 
        <div style={{marginLeft:100, marginTop: 20, width: 1550}}> 
        
            <Button variant="outlined" 
                color="primary"  
                startIcon={<KeyboardBackspaceIcon /> } 
                onClick={this.props.setUsersPage}
            >
            GO BACK
            </Button> 
            <Button variant="contained" 
                color="primary"   
                style = {{marginLeft: 8}} 
                onClick = {this.handleDeleteUsers}
                disabled={ this.state.selectedUsers.length < 1  ||
                            this.state.loading === true ||
                            this.state.apiSucceeded === true ||
                            this.state.API_err === true }
                >
                DELETE USERS&nbsp;({this.state.selectedUsers.length})
                </Button> 
            <hr />
            {   this.state.loading === false && 
                this.state.apiSucceeded === false &&
                this.state.API_err === false  &&
            (
                <Container>
                    <Row> 
                    <Col xs={12}> 
                        <BootstrapTable
                            keyField='_id'
                            data={ this.state.users }
                            columns={ this.userColumns }
                            selectRow={ this.handleProfileRowSelect }
                        />
                    </Col> 
                    </Row> 
                </Container> 
                   
            )}
            {this.state.apiSucceeded && ( 
                <Alert style={{marginTop: 20}} severity="success">
                    <AlertTitle>Successfully removed ({this.state.selectedUsers.length})</AlertTitle>
                </Alert>
            
            )} 
           
            {/* API ERRORS */}
            <div style={{width: 1200, marginLeft: 50}}>
                {/* API ERROR */}
                {this.state.API_err && (
                    <Alert style={{marginTop: 20}} severity="error">
                        <AlertTitle>There was an API issue, Restart the app and try again</AlertTitle>
                    </Alert>
                )} 
              
            </div> 
    
        </div>
    </div>
    )
  }
 
}