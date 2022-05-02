var express = require('express');
var http = require('http');
var app = express();
const jwt = require("jsonwebtoken");
const port = 2000;
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
app.use(express.json());


const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barcode'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

app.get("/user-list", function(req, res){
  connection.query('SELECT * from users', (err, rows) => {
    if(err) throw err;
    console.log('The data from users table are: \n', rows);
    res.send(rows);
    connection.end();
  });
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("view engine", 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.static(`${__dirname}/public`))

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload-barcodes');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `/admin-${file.fieldname}-${Date.now()}.${ext}`)
  }
});

const fileFilters = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'png' || file.mimetype.split('/')[1] === 'jpeg' || file.mimetype.split('/')[1] === 'jpg') {
    cb(null, true)
  } else {
    cb(new Error('Not an image file!!'), false)
  }
};

const fileUpload = multer({
 storage: fileStorage,
 fileFilter: fileFilters
}); 

app.post("/api/uploadFile", fileUpload.single("myFile"), (req, res) => {
  try {
    const newFile = File.create({
      name: req.file.filename
    });
    req.method = 'get'; 
    res.redirect('http://localhost:2000/');

    res.status(200).json({
      status: "success",
      message: "File Created Successfully!!"
    });
  } catch (error) {
    req.method = 'get'; 
    res.redirect('http://localhost:2000/');
    res.status(200).json({
      status: "success",
      message: "File Created Successfully!!"
    });
  }

});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running :
    http://localhost:${port}/`);
  });
  
  