import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { CurrentQuestion } from "./CurrentQuestion";
import { LeaderBoard } from "./Leaderboard";
import { json } from "react-router-dom";

export const User = () => {
    const [name, setName]= useState("");
    const[submitted, setSubmitted]= useState(false);
    if(!submitted){
        return <div>
            Name- <input type="text" placeholder="name" onChange={(e)=>{
                setName(e.target.value)
            }}/>        
            <button onClick={()=> {
               setSubmitted(true);
            }}> Submit</button>    
        </div>
    }

    return<UserLoggedIn name={name} />
}


export const UserLoggedIn = ({name}) => {
    const searchParams = new URLSearchParams(document.location.search)
    const [socket, setSocket]= useState<null | any>(null);
    const roomId= searchParams.get("roomId");
    const [currentState, setCurrentState] = useState("not_started");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [leaderboard, setLeaderBoard] = useState(null);
    const [userId, setUserId]= useState("")

    useEffect(() => {   
        const socket = io("http://localhost:3000");
        setSocket(socket)


        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("join",{
                roomId,
                name
            })
        });

        socket.on("init", ({userId, state})=> {
            setUserId(userId);
            if (state.leaderboard){
                setLeaderBoard(state.leaderboard)
            }
            
            if(state.problem){
                setCurrentQuestion(state.problem);
            }

            setCurrentState(state.type);
        });
        socket.on("leaderboard",(data)=>{
            setCurrentState("leaderboard");
            setLeaderBoard(data.leaderboard);
        })
        socket.on("problem", (data)=>{
            setCurrentState("question");
            setCurrentQuestion(data.problem);
        })
    }, []);

    if(currentState === "not_started"){
        return <div>
            This Quiz has not started yet
        </div>
    }
    if(currentState === "question"){
        <div>
            return <CurrentQuestion question= {currentQuestion}/>
        </div>
    }
    if(currentState === "leaderboard"){
        <div> 
            return <LeaderBoard leaderboard= {leaderboard}/>
        </div>
    }

    return <div>
        <br />
        Quiz has ended
    </div>
}