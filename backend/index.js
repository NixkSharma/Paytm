const express = require('express');
const apiRouter = require('./routes/index');
const cors = require('cors');

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRouter);

app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(400).json({
        message : "Some error occured",
    });
});

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));