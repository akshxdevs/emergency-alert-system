import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/user",);
app.use("/api/v1/alert",);

app.listen(()=>{
    console.log(`server running on port ${PORT}`);
});