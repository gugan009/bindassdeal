import {Component} from 'react'
import './index.css'
import {v4 as uuidv4} from 'uuid'
import Player from '../Player'
import logo from '../../images/logo.jpg' 
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

const cricket = [
    {
        id: uuidv4(),
        name: "Virat Kholi",
        runs: 4572,
    },
    {
        id: uuidv4(),
        name: "Rohit Sharma",
        runs: 3973,
    },
    {
        id: uuidv4(),
        name: "Mahendra Singh Dhoni",
        runs: 2475,
    },
    {
        id: uuidv4(),
        name: "Suresh Raina",
        runs: 5119,
    },
]

class Home extends Component{

    state = {
        cric: cricket, 
        addName:'', 
        addRun:'', 
        isEdit: false,
        editName:'',
        editRun: '',
        searchPlayer:'',
        editId:'',
    }


    onClickLogout = () => {
        Cookies.remove('jwt_token')
        const {history} = this.props 
        history.replace("/login")
    }

    changeAddName = event => {
        this.setState({addName: event.target.value})
    }

    changeAddRun = event => {
        this.setState({addRun: event.target.value})
    }

    onEditName = event => {
        this.setState({editName: event.target.value})
    }

    onEditRun = event => {
        this.setState({editRun: event.target.value})
    }

    onSubmitForm = event => {
        event.preventDefault()
        const {addName, addRun} = this.state 
        const details = {
            name: addName,
            runs: parseInt(addRun),
            id: uuidv4(),
        }
        this.setState(prevState => ({
            cric: [...prevState.cric, details],
            addName: '',
            addRun:'',
        }))
    }

    onSubmitEditForm = () => {
        const {editName, editRun, cric, editId} = this.state
        const editedList = cric.map(info=>{
            if(info.id===editId){
                return {
                    name: editName,
                    runs: parseInt(editRun),
                    id: info.id,
                }
            }else{
                return info
            }
        })
        this.setState({cric: editedList, 
            isEdit: false,
            editName:'',
            editRun:'',
            editId:'',
        })
    }

    onDeletePlayer = (id) => {
        const {cric} = this.state
        const filteredList = cric.filter(each => each.id !== id)
        this.setState({cric: filteredList})
    }

    onEditPlayer = (each) => {
        this.setState({editRun: each.runs, editName: each.name, editId: each.id, isEdit: true})
    }

    onChangeSearch = event =>{
        this.setState({searchPlayer: event.target.value})
    }

    render(){
        const jwtToken = Cookies.get('jwt_token')
        if(jwtToken===undefined){
            return <Redirect to='/login' />
        }
        const {cric, addName, addRun,isEdit, editRun, searchPlayer, editName} = this.state
        const filterCric = cric.filter(each => each.name.toLowerCase().includes(searchPlayer.toLowerCase()) )
        return(
            <>
            <nav className='nav-container'>
                <img src={logo} alt="company" className='logo'/>
                <button className='logout-btn' onClick={this.onClickLogout}>Logout</button>
            </nav>
            <div className='home-container'>
                <div className='table-container'> 
                <h1 className='topic'>Players Info</h1>   
                <input type="search" value={searchPlayer} onChange={this.onChangeSearch} className='input' placeholder='Search Players' />       
                    <ul className='ul'>
                            {
                                filterCric.map(each =>(
                                    <Player onEditPlayer={this.onEditPlayer} onDeletePlayer={this.onDeletePlayer} each={each} key={each.id} />
                                ))
                            }
                    </ul>
                </div>

                {isEdit &&(<div className='edit-container'>
                    <h1 className='topic'>Edit Players</h1>
                    
                        <form onSubmit={this.onSubmitEditForm}>
                            <div className='input-container'>
                                <label htmlFor='editName' className='label'>Name</label>
                                <input onChange={this.onEditName} value={editName} id="editName" className='input' type='text' />
                            </div>
                            <div className='input-container'>
                                <label htmlFor='editRuns' className='label'>Runs</label>
                                <input onChange={this.onEditRun} value={editRun} id="editRuns" className='input' type='text' />
                            </div>
                            <button type='submit' className='button-add'>Edit</button>
                        </form>       
                </div>)}

                <div className='add-players-container'>
                    <h1 className='topic'>Add Players</h1>
                    <form onSubmit={this.onSubmitForm}>
                        <div className='input-container'>
                            <label className='label'>Name</label>
                            <input value={addName} onChange={this.changeAddName} className='input' type='text' />
                        </div>
                        <div className='input-container'>
                            <label className='label'>Runs</label>
                            <input value={addRun} onChange={this.changeAddRun} className='input' type='text' />
                        </div>
                        <button type='submit' className='button-add'>Add</button>
                    </form>
                </div>
            </div>
            </>
        )
    }
}

export default Home