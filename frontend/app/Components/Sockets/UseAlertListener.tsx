import { useEffect } from "react"
import { WS_URL } from "../../../config";

export const UseAlertListener = (userId:string,userRole:string,onMessage:(data:any)=>void) => {
    useEffect(()=>{
        if (!userId || !userRole) return;
        const ws = new WebSocket(`${WS_URL}/${userId}/?${userRole}`);
        ws.onopen = () => {
            // WebSocket Connected
        };
        ws.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                onMessage(data);
            } catch (error) {
                console.error(error);
            }
        }
        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        }
        return () => {
            ws.close();
        };
    },[userId,onMessage])

}