const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const port = 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x7xfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload())
app.use(express.static('doctors'))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");

  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(result => {
        res.send(result.acknowledged)
    })
    .catch(err => console.log(err))
 })

 app.get('/allAppointments',(req, res) =>{
   appointmentCollection.find({})
   .toArray((err, documents) => {
     res.send(documents)
     console.log(err);
   })
 })

 app.post('/appointmentsByDate', (req, res) => {
   const date = req.body;
   console.log(date.selectedDate);
   appointmentCollection.find({date: date.selectedDate})
   .toArray((err, documents) => {
     res.send(documents)
     console.log(documents);
    })
 })

 app.post('/addDoctor',(req, res) =>{
   const file = req.files.file;
   const name = req.body.name;
   const email = req.body.email;
   console.log(name,email, file);

   file.mv(`${__dirname}/doctors/${file.name}`,err =>{
     if(err){
       res.status(500).send({msg: "image upload failed"})
     }
     return res.send({name: file.name, path: `/${file.name}`})

   })
   
 })
 
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})