import CreateRoomForm from "./createRoomForm/CreateRoomForm";
import JoinRoomForm from "./joiningRoomForm/JoinRoomForm";
import "./index.css"

const Forms = ({uuid,socket,setUser})=>{
    return (
        <div className="row h-100 pt-5">
            <div className="col-md-4 mt-5 p-5 px-5 form-box border border-2 border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Create Room</h1>
                <CreateRoomForm uuid = {uuid} socket={socket} setUser={setUser}/>
            </div>
            <div className="col-md-4 mt-5 p-5 px-5 form-box border border-2 border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Join Room</h1>
                <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
            </div>
        </div>
    );
}

export default Forms;