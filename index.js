var express = require('express');
var multer  = require('multer');
var cors    = require('cors');
var link    = require('fs-symlink');
var mkdirp  = require('mkdirp');
var md5File = require('md5-file')

var app = express();
app.use(cors());

var upload_folder  = 'uploads';
var symlink_folder = 'symlinks';

// Ensure that folders are created
var folder_callback = function(err) { if(err) console.error(err); };
mkdirp(upload_folder, folder_callback);
mkdirp(symlink_folder, folder_callback);


// Serve contents of uploads folder
var directory = require('serve-index');
app.use('/uploads/', directory(upload_folder, {'icons': true}));
app.use('/uploads/', express.static(upload_folder + '/'));
// ... and of the symlinks folder
app.use('/symlinks/', directory(symlink_folder, {'icons': true}));
app.use('/symlinks/', express.static(symlink_folder + '/'));
// ... and of the symlinks folder
app.use('/visualize/', directory(symlink_folder, {'icons': true}));
app.get('/visualize/:path*', function(req, res)
{
    var path_str = req.url.substr("/visualize/".length);
    console.log(path_str);
    //var path_str = req.params.path;
    if(path_str.endsWith(".csv"))
    {
        res.redirect('http://skeen.website:3002/?file=' + path_str);
    }
    else
    {
        res.redirect('/symlinks/' + path_str);
    }
});

app.use('/md5/', directory(symlink_folder, {'icons': true}));
app.get('/md5/:path*', function(req, res)
{
    var path_str = req.url.substr("/md5/".length);
    console.log(path_str);

    md5File(symlink_folder + '/' + path_str, function(err, hash)
    {
        if(err)
        {
            res.status(500);
            res.end(JSON.stringify(err));
            return;
        }

        res.status(200);
        res.end(hash);
    });
});

// Upload file to server
var upload = multer({ dest: upload_folder + '/' });
app.post('/upload', upload.single('file'), function(req, res, next) 
{
    // Ensure that a file was provided
    if(req.file === undefined)
    {
        res.status(400);
        res.end("Missing payload: file");
        return;
    }
    // ... and a file name
    if(req.body.filename === undefined)
    {
        res.status(400);
        res.end("Missing payload: filename");
        return;
    }
    // Read them out
    var path = req.file.path;
    var filename = req.body.filename;
    // ... and print them
    console.log(path);
    console.log(filename);

    // Symlink the file for ease of access
    link(req.file.path, symlink_folder + '/' + req.body.filename, 'junction').then(function(error)
    {
        // Succes
        res.status(200);
        res.end(req.file.path);
    }, function(error)
    {
        res.status(500);
        res.end(error);
    });
});

app.get('/', function(req, res)
{
    res.sendFile("index.html", {root: __dirname});
});

var port = parseInt(process.argv[2]);
var port = port || 3000;
app.listen(port, function() 
{
    console.log('Reading reciever server on port: ' + port);
});
