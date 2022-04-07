



const RequireAuth = ( ) => { 
    const token = JSON.parse(localStorage.getItem('UQMpWKN1JxSAATzETMO3'))
     if(token){
         return true
     }else{
         return false
     }
} 

export { RequireAuth }