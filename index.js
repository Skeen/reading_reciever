var express = require('express');
var multer  = require('multer');
var cors = require('cors');
var app = express();
app.use(cors());

// Serve contents of uploads folder
var directory = require('serve-index');
app.use('/uploads/', directory('uploads', {'icons': true}));
app.use('/uploads/', express.static('uploads/'));

// Upload file to server
var upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), function(req, res, next) 
{
    console.log(req.file);
    console.log(req.body.filename);

    res.status(200);
    res.end(req.file.path);
});


app.listen(3000, function() 
{
    console.log('Example app listening on port 3000!');
});
