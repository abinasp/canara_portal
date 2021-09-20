import cors from 'cors';
import express from 'express';
import router from './Routes/routes.js';

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use("/app", router);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
})

// app.get("/", (req, res) => {
//   res.send("Hello world");
// })