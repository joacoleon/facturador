import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './Routes/index.js';
import errorHandler from './Middlewares/ErrorHandling.js';


const dbUrl = 'mongodb+srv://gupdbuser:d1uADF2EZWNhv8Aq@clusterfacturador.yjq6n.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFacturador';
mongoose.set('strictQuery', false);

async function connect(){
    await mongoose.connect(dbUrl);
}

connect()
.then(console.log('DB connected'))
.catch(e => console.log(e));

const app = express();
const __dirname = path.resolve();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);
app.use((req, res, next)=>{ //Un 404 no es un error para node, por eso hay que capturarlo aca y no en el errorHandler
    res.status(404).send({
        success: false,
        code: 404,
        message:"Invalid endpoint"
    });
  });
app.use(errorHandler);

app.set('port', process.env.PORT || 3000);
let port = app.get('port');
app.listen(port, () => {
    console.log('Server on port ' + port);
});