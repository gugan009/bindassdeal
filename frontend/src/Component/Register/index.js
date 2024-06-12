import {Component} from 'react'
import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Register extends Component{
    state = {
        username:'', 
        password:'',
        name:'',
        confirmPassword:'',
        isError: false,
        errMsg: '',
        isSuccess: false,
    }

    onClickLogin = () =>{
        const{history} = this.props
        history.replace('/login')
    }

    onChangeName = event => {
        this.setState({name: event.target.value})
    }

    
    onChangeUsername= event => {
        this.setState({username: event.target.value})
    }

    
    onChangePassword = event => {
        this.setState({password: event.target.value})
    }

    
    onChangeConfirmPassword = event => {
            this.setState({
                confirmPassword: event.target.value,
            })
    }

    onSubmitForm =async event => {
        event.preventDefault()
        this.setState({isError: false, errMsg:''})
        const {username, password, name, confirmPassword} = this.state
        if(username!=='' && password!=='' && name!=='' && confirmPassword!==''){
            if(password===confirmPassword){
                if(password.length > 5){
                    const userDetails = {
                        name,
                        username,
                        password
                    }
                    const url = "http://localhost:9000/users/"
                    const option = {
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userDetails)
                    }
                    const response = await fetch(url, option)
                    const data = await response.json()    
                    if(response.ok === true){
                        this.setState({
                            errMsg:'', 
                            isError:false, 
                            isSuccess: true,
                            username:'',
                            password:'',
                            confirmPassword:'',
                            name:'',
                        })
                    }else{
                        this.setState({errMsg: data.msg, isSuccess:false, isError:true})
                    }
                }else{
                    this.setState({errMsg: 'Password length should be greater 5', isSuccess:false,isError:true})
                }
                
            }else{
                this.setState({errMsg: 'Password mismatch', isSuccess:false,isError:true})
            }
        }else{
            this.setState({isError:true, isSuccess:false, errMsg:'Input cannot be empty'})
        }
    }

    render(){
        const {
            username, 
            password, 
            name, 
            confirmPassword, 
            isError,
            isSuccess, 
            errMsg
        } = this.state
        const jwtToken = Cookies.get("jwt_token")
        if(jwtToken!==undefined){
            return <Redirect to="/" />
        }
        return(
            <div className='register-container'>
                <form onSubmit={this.onSubmitForm} className='form'>
                    <h1 className='head'>Register</h1>
                    <div className='input-container'>
                        <label htmlFor='name' className='label'>NAME</label>
                        <input id='name' onChange={this.onChangeName} value={name} type='text'  className='input'/>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='username' className='label'>USERNAME</label>
                        <input onChange={this.onChangeUsername} value={username} id='username' type='text'  className='input'/>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='password' className='label'>PASSWORD</label>
                        <input onChange={this.onChangePassword} value={password}  id='password' type='password'  className='input'/>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='confirmPassword' className='label'>CONFIRM PASSWORD</label>
                        <input onChange={this.onChangeConfirmPassword} value={confirmPassword} id='confirmPassword' type='password'  className='input'/>
                    </div>
                    {isError &&<p className='err'>*{errMsg}</p>}
                    {isSuccess && <p className='success'>Successfully registered. Please Login</p>}
                    <button type='submit' className='signup-button'>Sign Up</button>
                </form>
                <div>
                    <p className='para'>Or already a user</p>
                    <button onClick={this.onClickLogin} className='button-login'>Login</button>
                </div>
            </div>
        )
    }
}

export default Register