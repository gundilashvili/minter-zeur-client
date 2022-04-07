import React, { Component } from 'react';  
import Button from '@material-ui/core/Button'; 
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert'; 
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';    
import DialogContent from '@material-ui/core/DialogContent';    
import DialogActions from '@material-ui/core/DialogActions';   
import axios from 'axios';  
import MaterialDatatable from "material-datatable";  
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';  
import Launch from '@material-ui/icons/Launch';
import TextField from "@material-ui/core/TextField";    
import { Grid } from "@material-ui/core"; 
import TextareaAutosize from '@mui/material/TextareaAutosize';
import getSupply from './getSupply';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';



export default class Contracts extends Component {
 
  state =  {     
    loading: false,
    apiError: false,
    actionSucceeded: false,
    data: [],
    requestObj: {},

    updateDialogOpen: false,
    actionDialogOpen: false,
    apiErrorText: "",
    actionTitle: "",
    requestUpdateNotes: '',
    currentSupply: "Loading data...",
    currentBalance: "Source not available"
     
  } 

  getMuiTheme = () => createTheme({
    overrides: {
      MUIDataTable: {
       height: 800
      }
    }
  })


  componentDidMount = async () => {
    this.getData()
    const currentSupply = await getSupply()
    this.setState({currentSupply})
  } 
  

  

  // FETCH USERS FROM DATABASE
  getData = async () => {
    try{

     const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
     if(token){ 
       await axios
         .get("/api/request", { headers: { 'x-auth-token': token  } })
         .then(res => {
           if(res.status === 200){ 
             this.setState({loading: false, data: res.data.reverse() })
           }else{
             this.setState({apiError: true, apiErrorText: "Something went wrong!", loading: false })
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
      this.setState({apiError: true, apiErrorText: e.message})
    }
 }






 handleDeleteRecord = async () => {
  try{
    this.setState({loading: true})
    const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
    await axios
    .put('/api/request',{  _id: this.state.requestObj._id },{ headers: { 'x-auth-token': token } })
    .then(async(res) => {
       if(res.status === 200){
        await this.getData()
        this.setState({
          loading: false,
          actionSucceeded: true,
          updateDialogOpen: false ,
          actionTitle: "Successfully deleted!"
        })
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



handleDeclineRequest = async () => {
  try{
    this.setState({loading: true})
    const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
    await axios
    .post('/api/request/update',{  _id: this.state.requestObj._id, Status: 'Declined' },{ headers: { 'x-auth-token': token } })
    .then(async(res) => {
       if(res.status === 200){
        await this.getData()
        this.setState({
          loading: false,
          actionSucceeded: true,
          updateDialogOpen: false ,
          actionTitle: "Successfully declined!"
        })
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



handleApproveTransaction = async () => {
  try{
    this.setState({loading: true})
    const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
    await axios
    .post('/api/request/mint',{  _id: this.state.requestObj._id},{ headers: { 'x-auth-token': token } })
    .then(async(res) => {
       if(res.status === 200){
        await this.getData()
        this.setState({
          loading: false,
          actionSucceeded: true,
          updateDialogOpen: false ,
          actionTitle: "Transaction sent successfully!"
        })
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


updateRequestData = async () => {
  try{
    this.setState({loading: true})
    const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
    await axios
    .post('/api/request/update',{  
      _id: this.state.requestObj._id,
      Message: this.state.requestUpdateNotes
    },
    { headers: { 'x-auth-token': token } })
    .then(async(res) => {
       if(res.status === 200){
        await this.getData()
        this.setState({
          loading: false,
          actionSucceeded: true, 
          actionTitle: "Request notes saved!"
        })
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



 columns = [
  {
      name:  'Actions' ,  
      options: { 
        width: 1, 
          customBodyRender: (row) => {
              return  <div > 
                      <Button  
                          startIcon={<Launch />}
                          variant="outlined"
                          onClick={( ) => {  
                            this.setState({ 
                              requestObj: row, 
                              requestUpdateNotes: row.Message,
                              updateDialogOpen : true   
                            })
                          }}>   
                        View Request
                      </Button>     
              </div>
          }
      } 
  },
 
    {   
      name: 'Status', 
      field: 'Status',
      options: {
          width: 50,
      },
    },
    {   
      name: 'Amount', 
      field: 'Amount',
      options: {
          width: 50,
      },
    },  
    {   
      name: 'Recipient address', 
      field: 'Address',
      options: {
          width: 50,
      },
    }, 
    {   
      name: 'Date', 
      field: 'CreateDate',
      options: {
          width: 50,
      },
    },
   
    
]  



options = {
    filterType: 'checkbox',
    selectableRows: false,
    rowsPerPage: 100,
    responsive: 'stacked'  
} 

 
handleUpdateDialogOpen = () => {
  this.setState({updateDialogOpen: true})
}  
handleUpdateDialogClose = () => {
  this.setState({updateDialogOpen: false})
} 
 
 
 render() {

  function Alert(props) {
    return <MuiAlert  elevation={6} variant="filled" {...props} />;
  }


  return (
    <div style={{ width: '100%'}}>  
  
      <div >
        <MuiThemeProvider theme={this.getMuiTheme()}>
                <MaterialDatatable  
                    title={"Requests (" + this.state.data.length + ")"}
                    data={this.state.data}
                    columns={this.columns}
                    options={this.options}
                />
          </MuiThemeProvider>
       </div> 


    


      {/* Request dialog */}
      <Dialog open={this.state.updateDialogOpen} 
          onClose={this.handleUpdateDialogClose} 
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          fullWidth={true}
        > 
         <DialogTitle id="form-dialog-title">Request data
         
         <IconButton
            aria-label="close"
            onClick={this.handleUpdateDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8, 
            }}
          >
                <CloseIcon />
          </IconButton>
         </DialogTitle> 
        < DialogContent>   
          <Grid container spacing={4}  style={{ backgroundColor: "white" }}>
            <Grid   item   lg={6}  sm={6}  xl={6}  xs={6}  > 
              <TextField
                style={{width: 520, marginTop: 20}} 
                margin="dense"
                variant="outlined"
                id="Status"
                label="Status"
                type="text" 
                value={this.state.requestObj.Status} 
              />  

              <TextField
                style={{width: 520, marginTop: 20}} 
                margin="dense"
                variant="outlined"
                id="amount"
                label="Requested amount"
                type="text" 
                value={this.state.requestObj.Amount} 
              />  

              <TextField
                style={{width: 520, marginTop: 20}} 
                margin="dense"
                variant="outlined"
                id="supply"
                label="Total supply of zEUR"
                type="text" 
                value={this.state.requestObj.TotalSupply} 
              />  

              <TextField
                style={{width: 520, marginTop: 20}} 
                margin="dense"
                variant="outlined"
                id="balance"
                label="EUR balance on IBAN account"
                type="text" 
                value={this.state.requestObj.EurBalance} 
              />  


              <TextField
                style={{width: 520, marginTop: 20}} 
                margin="dense"
                variant="outlined"
                id="Mintable"
                label="Mintable amount"
                type="text" 
                value={this.state.requestObj.EurBalance + " - " + this.state.requestObj.TotalSupply + " = " + this.state.requestObj.MintableAmount} 
              />  

              <TextField
                style={{width: 520, marginTop: 20}} 
                margin="dense"
                variant="outlined"
                id="address"
                label="Recipient address"
                type="text" 
                value={this.state.requestObj.Address} 
              />  

              
              <TextField
                style={{width: 520, marginTop: 10, marginBottom: 50}} 
                margin="dense"
                variant="outlined"
                id="Date"
                label="Date"
                type="text" 
                value={this.state.requestObj.CreateDate} 
              />  
            </Grid>
            <Grid   item   lg={6}  sm={6}  xl={6}  xs={6}  > 
              <TextField
                  style={{width: 520, marginTop: 22 }} 
                  margin="dense"
                  variant="outlined"
                  id="Current supply of zEUR"
                  label="Current supply of zEUR"
                  type="text" 
                  value={this.state.currentSupply} 
                />  
                <TextField
                  style={{width: 520, marginTop: 22 }} 
                  margin="dense"
                  variant="outlined"
                  id="Current balance"
                  label="Current balance on IBAN account"
                  type="text" 
                  value={this.state.currentBalance} 
                />  
                <TextField
                  style={{width: 520, marginTop: 22 }} 
                  margin="dense"
                  variant="outlined"
                  id="Transaction"
                  label="Transaction"
                  type="text" 
                  value={this.state.requestObj.RequestTransaction} 
                />  
                <TextareaAutosize 
                  aria-label="minimum height"
                  minRows={8}
                  placeholder="Request notes..."
                  style={{ width: 520, marginTop:22}}
                  value={this.state.requestUpdateNotes} 
                  onChange={event => this.setState({ requestUpdateNotes: event.target.value })}
                />
                <br/>
                <Button 
                  variant="outlined"
                  onClick={this.updateRequestData}
                  disabled={this.state.loading=== true}
                >Save
                </Button>
            </Grid>
          </Grid>

          
        </DialogContent>
        <DialogActions> 
          <div style={{marginBottom: 7}}>
            <Button variant="outlined" 
              color="secondary" 
              onClick={this.handleDeleteRecord}  
              style={{width:150}}
              disabled={this.state.loading} 
            >
              Delete
            </Button>  

            <Button variant="outlined" 
              color="secondary" 
              onClick={this.handleDeclineRequest}  
              style={{width:150, marginLeft: 7}}
              disabled={this.state.loading || this.state.requestObj.Status !== 'Pending'} 
            >
                Decline
            </Button>  
            
            <Button  variant="outlined"
                  color="primary"
                  onClick={ this.handleApproveTransaction } 
                  disabled={this.state.loading || (this.state.requestObj.Status !== 'Pending' && this.state.requestObj.Status !== 'Failed')}
                  textTransform="none" 
                  style={{ marginLeft: 7}}
              >
                Mint ({parseFloat(this.state.requestObj.Amount).toFixed(4)} zEUR)
            </Button> 
            </div>
           
        </DialogActions>     
      </Dialog>


 
     
      {/* Success snapckbar */}
      <Snackbar 
        open={this.state.actionSucceeded} 
        autoHideDuration={8000}  
        onClose={() => this.setState({actionSucceeded: false}) }
        anchorOrigin={{vertical: 'top', horizontal:'right'}}
      >
        <Alert severity="success"  style={{marginTop: 100,  width: 300}}>
          {this.state.actionTitle}
        </Alert>
      </Snackbar> 
  
      {/* API error snapckbar  */}
      <Snackbar 
        open={this.state.apiError} 
        autoHideDuration={10000}  
        onClose={() => this.setState({apiError: false}) }
        anchorOrigin={{vertical: 'top', horizontal:'right'}}
      >
        <Alert severity="error"  style={{marginTop: 100, marginRight: 50,width: 300}}>
          {this.state.apiErrorText}
        </Alert>
      </Snackbar>



    </div>
  ) 
 }
    
}
 