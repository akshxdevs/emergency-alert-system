import { useEffect, useState } from "react"

export const UseAlertListener = (userId:string,userRole:string,onMessage:(data:any)=>void) => {
    useEffect(()=>{
        if (!userId || !userRole) return;
        const ws = new WebSocket(`ws://localhost:3000/${userId}/?${userRole}`);
        ws.onopen = () => {
            console.log("Websocket Connected");
        };
        ws.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                console.log(data);
                onMessage(data);
            } catch (error) {
                console.error(error);
            }
        }
        ws.onerror = (err) => {
            console.log(err);
        }
        return () => {
            ws.close();
        };
    },[userId,onMessage])

}