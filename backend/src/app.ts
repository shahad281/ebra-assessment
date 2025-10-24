import express from "express";
import dotenv from "dotenv";
import callsRoutes from "./routes/calls";
import callbacksRoutes from "./routes/callbacks";
import { worker } from "./services/worker";

worker(); 




dotenv.config();

const app = express();
app.use(express.json());

app.use("/calls", callsRoutes);
app.use("/callbacks", callbacksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
