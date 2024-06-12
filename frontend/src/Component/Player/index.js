import './index.css'
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

const Player = (props) => {
    const {each,onDeletePlayer, onEditPlayer} = props 
    const {name,runs,id} = each
    const onDelete = () =>{
        onDeletePlayer(id)
    }
    const onEdit = () =>{
        onEditPlayer(each)
    }
    return(
        <li className='li'>
            <div className='con'>
                <p className='info'>{name}</p>
                <p className='info'>{runs}</p>
            </div>
            <div className='cons'>
                <button onClick={onEdit}  className='btn'><FaEdit /></button>
                <button onClick={onDelete} className='btn'><MdDelete /></button>
            </div>
        </li>
    )
}

export default Player