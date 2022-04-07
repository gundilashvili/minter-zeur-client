import Web3 from 'web3'


const getSupply = async () => {
    try{

        const web3   = new Web3("https://rinkeby.infura.io/v3/d2d45baa4f394ae1b50d3bea928d4497")  
        const ABI = [ {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
      
        const tokenAddress = "0x9Fc452DF55c96c639085C564E40d0Ea2A0b28e60"
        const tokenContract =  await new web3.eth.Contract( ABI, tokenAddress) 
        const supplyInWei =  await  tokenContract.methods.totalSupply().call()
        const supply =  parseFloat(supplyInWei) / 1000000
        return supply

    }catch(e){
        console.log(e)
    }
}



export default getSupply