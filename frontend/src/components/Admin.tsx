import { useEffect } from "react";
import { io } from "socket.io-client";


export const Admin = () => {

    useEffect(() => {
        const socket = io("https://localhost:3000");
        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("joinAdmin",{
                password: "ADMIN_PASSWORD"
            })
        });
        socket.on("")
    }, [])

    return <div>
        hi from Admin
    </div>
}