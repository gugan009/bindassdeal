import {Component} from 'react'
import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component{

    state = {username:'', password:'', isError: false, errorMsg:""}

    onChangePassword = (event) => {
        this.setState({password: event.target.value})
    }

    onChangeUsername = event => {
        this.setState({username: event.target.value})
    }

    onSubmitForm = async event => {
        event.preventDefault()
        this.setState({isError:false, errorMsg:''})
        const {username,password} = this.state
        const userDetails = {
            username,
            password
        }
        const url ="http://localhost:9000/login/"
        const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, option)
        const data = await response.json()
        if(response.ok === true){
            this.setState({isError: false, errorMsg:""})
            console.log(this.props)
            const {history} = this.props
            Cookies.set("jwt_token",data.jwtToken,{expires: 3})
            history.replace("/")

        }else{
            this.setState({isError: true, errorMsg: data.msg})
        }
        
    }

    onClickSignUp = () => {
        const {history} = this.props 
        history.replace("/register")
    }

    render(){
        const {username,password,isError, errorMsg} = this.state
        const jwtToken = Cookies.get("jwt_token")
        if(jwtToken!==undefined){
            return <Redirect to="/" />
        }
        return(
            <div className='login-container'>
                <form onSubmit={this.onSubmitForm} className='form'>
                    <h1 className='head'>Login</h1>
                    <div className='input-container'>
                        <label htmlFor='username' className='label'>USERNAME</label>
                        <input onChange={this.onChangeUsername}  value={username} id='username' type='text'  className='input'/>
                    </div>
                    <div className='input-container'>
                        <label htmlFor='password' className='label'>PASSWORD</label>
                        <input id='password' value={password} onChange={this.onChangePassword} type='password' className='input' />
                    </div>
                    {isError && <p className='err'>*{errorMsg}</p>}
                    <button type='submit' className='button'>Login</button>
                </form>
                <div>
                    <p className='para'>Or don't have an Account</p>
                    <button onClick={this.onClickSignUp} className='sign-button'>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default Login