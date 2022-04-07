
import React, { Component } from 'react';  
import Button from '@material-ui/core/Button'; 
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';    
import TextField from "@material-ui/core/TextField"; 
import axios from 'axios'; 

export default class Contracts extends Component {


    state = {
        loading: false,
        apiError: '', 
        username: '',
        username_error: '',
        password: '',
        password_error:''
    }
 

    handleAuthorize = async () => {
        try{
            const username = this.state.username 
            const password = this.state.password
 
            if(username.length && password.length){
                this.setState({loading: true})
                await axios
                .post('/api/users/auth', {Username: username, Password: password})
                .then(res => { 
                    if(res.status === 200){ 
                      
                        if(res.data.token){ 
                            this.setState({loading: false})
                            localStorage.setItem('UQMpWKN1JxSAATzETMO3', JSON.stringify(res.data.token)) 
                            window.location = '/'   
                        }else{
                            this.setState({loading: false, apiError: res.data.message})
                        } 
                    }else{
                        this.setState({ loading: false, apiError: 'There was an API issue!'})
                    }
                })
            }else{
                if(username.length<1){
                    this.setState({username_error: 'Username is required!'})
                }else  if(password.length<1){
                    this.setState({password_error: 'Password is required!'})
                }
               
            }

           
           

        }catch(e){
            this.setState({ loading: false, apiError: 'There was an API issue!'})
            console.log(e.message)
        }
    }
 




    render() {  
        function Alert(props) {
            return <MuiAlert  elevation={6} variant="filled" {...props} />;
        }
        return (     
            <div style={{   height:"100%",   margin: "0px",   padding: "0px"  }}> 
 
                <div style={{ display: "table",  height: "100%",  margin: "0 auto"  }}>
                     
                    <div style={{  display: "table-cell"  }}> 

                        <div style={{ width: "300px",  marginTop: "90%"  }}>

                            <TextField   
                                label="Username" 
                                variant="outlined" 
                                style={{width: 300}} 
                                onChange={event => {
                                    if( event.target.value.length){
                                        this.setState({
                                        username: event.target.value,
                                        username_error: ''
                                        }) 
                                    } 
                                }}
                                helperText={this.state.username_error}
                                error={this.state.username_error.length}
                            />
                            <br/> <br/>
                            <TextField 
                                label="Password" 
                                type="password" 
                                variant="outlined" 
                                style={{width: 300}} 
                                onChange={event => {
                                    if( event.target.value.length){
                                        this.setState({
                                        password: event.target.value,
                                        password_error: ''
                                        }) 
                                    } 
                                }}
                                helperText={this.state.password_error}
                                error={this.state.password_error.length}
                            />
                            <br/> <br/>
                            <Button  
                                variant="contained"
                                color="primary"
                                onClick={this.handleAuthorize}
                                style={{width: 300,height:50}}
                                disabled={this.state.loading === true}
                            >  Log In
                            </Button>   
                        </div>

                    </div> 
                    
                </div>


                {/* API error snapckbar  */}
                <Snackbar 
                    open={this.state.apiError.length > 0} 
                    autoHideDuration={5000}  
                    onClose={() => this.setState({apiError: ''}) }
                    anchorOrigin={{vertical: 'top', horizontal:'right'}}
                >
                    <Alert severity="error"  style={{marginTop: 100, marginRight: 50,width: 300}}>
                    {this.state.apiError}
                    </Alert>
                </Snackbar>  
            </div>    
        ) 
    } 
}
