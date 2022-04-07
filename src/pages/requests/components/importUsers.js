import React, { Component } from 'react' 
import { CSVReader } from 'react-papaparse' 
import Button from '@material-ui/core/Button';     
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';   
import BackupIcon from '@material-ui/icons/Backup';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'; 
import { Alert, AlertTitle } from '@material-ui/lab'; 
 


export default class ImportUsers extends Component {
 
    state = {  
      tempData: [],
      importSuccess: false,
      API_err: ''  
    } 

   
  handleOnDrop = (data) => { 
    let users = data
    users.shift()

    let _tempData = [] 
      for(let i of users){  
          if(i.data.length > 1 && i.data[0] !== ''  ){   
           let obj = {  
              Address:   i.data[0],
              Reward: parseInt(i.data[1]),  
              Airdrop:  i.data[2]   
            } 
            if(obj.Address.length > 1 && obj.Reward  > 1 && obj.Airdrop.length > 1){
                _tempData.push(obj)
            }  
          }
      } 
      if(_tempData.length){
        this.setState({tempData: _tempData})
      } 
  }

  handleOnError = (err, file, inputElem, reason) => {
    this.setState({uploadError: true})
    console.log(err)
  } 



  handleImportUsers = async () => {
    try{ 
    if(this.state.tempData.length){
        const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
        await axios
        .post('/api/address/import', {data: this.state.tempData},{   headers: { 'x-auth-token': token }})
        .then(res => { 
            if(res.status === 200){
                if(res.data.success){
                    this.setState({importSuccess: true})
                }else{ 
                    this.setState({API_err: res.data.message})
                }
            }else{ 
                localStorage.setItem('UQMpWKN1JxSAATzETMO3', JSON.stringify('')) 
                window.location = '/auth' 
            }
        })
    }

    }catch(e){ 
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
       
        <Button 
          variant={this.state.tempData.length ? "contained"  : "outlined"}
          color="primary" 
          style={{ marginLeft: 8}}
          onClick={this.handleImportUsers} 
          startIcon={<BackupIcon /> }  
          disabled={this.state.API_err || this.state.importSuccess || this.state.tempData.length < 1} >
           
            IMPORT USERS {   "("+ this.state.tempData.length+")" }
        </Button>     
        <hr /> 

        
        
        
        
        
        {/* FILE UPLOAD */}
        {this.state.tempData.length < 1 && 
         this.state.API_err.length < 1 && 
         this.state.importSuccess === false && (
            <CSVReader
            style={{width : 1200}}
            onDrop={this.handleOnDrop}
            onError={this.handleOnError} 
            addRemoveButton 
          >
            <span>Click or drop CSV to upload</span>
          </CSVReader>
        )} 



        {/* IMPORT SUCCEED */}
        {this.state.importSuccess && ( 
          <div  style={{ marginLeft: 0,marginTop:50, width: 1100}}>
            <Alert severity="success">
              <AlertTitle>Successfully Imported ({this.state.tempData.length})</AlertTitle> 
            </Alert>
          </div> 
        )}



         {/* API ISSUE */}
         {this.state.API_err.length > 0 && ( 
          <div  style={{ marginLeft: 0,marginTop:50, width: 1100}}>
            <Alert severity="error">
              <AlertTitle>{this.state.API_err}</AlertTitle> 
            </Alert>
          </div> 
        )}



         
         {this.state.tempData.length > 0 &&  
         this.state.API_err.length < 1 && 
         this.state.importSuccess === false && (
             <div  style={{  width: 1500 }}>
             <TableContainer component={Paper}>
               <Table  >
                 <TableHead>
                   <TableRow> 
                     <TableCell align="left">Address</TableCell>  
                     <TableCell align="left">Reward</TableCell>
                     <TableCell align="left">Airdrop</TableCell>    
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {this.state.tempData.map(row => (
                     <TableRow key={row.address}> 
                       <TableCell align="left">  {row.Address}   </TableCell> 
                       <TableCell align="left">{row.Reward}</TableCell>
                       <TableCell align="left">{row.Airdrop}</TableCell>  
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
           </TableContainer>
           </div>
         )}
        </div>
      </div>
    )
  }



}