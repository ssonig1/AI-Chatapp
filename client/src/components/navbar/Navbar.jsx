import './navbar.css'
import navbar from '../../assets/navbar.png'
const Navbar=()=>{
    return(
        <div className="navbar">
            <div className="navbar-content">
                <img className="nav-image" src = {navbar}/>
            </div>
        </div>
    )
}
export default Navbar