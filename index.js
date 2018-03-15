const express = require('express')
const app = express();
const path = require('path');
app.set('view engine', 'ejs');
const multer = require('multer');


app.use('/static', express.static('public')); // localhost:3001/static/123.txt
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '-' + Math.floor((Math.random() * 1000 + 1)) + path.extname(file.originalname))
    }
})
// file.fieldname = 'upload_file' from ---> "input name ="upload_file"" upload.ejs
// path.extname(file.originalname) ----> get the extension of the file// only extension e.g. jpg, png no filename


var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },  // 1mb 
    fileFilter: function (req, file, cb) {
        //allowed extension
        const filetypes = /jpeg|jpg|png|gif/;
        //check extension
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        //check mimetype
        const mimetype = filetypes.test(file.mimetype); //filetypes.test(file.mimetype): looking for filetypes in the minetype. e.g. RegExp.test('string'): look for RegExp in the string; return true or false
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error:images only!')
        }

    }
}).single('upload_file');
//.single('upload_file');// input name = 'upload_file' @upload.ejs;


app.get('/upload', (req, res) => {
    res.render('upload');
})

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            res.render('upload', {
                msg: err
            })
        } else {
            console.log(req.file);
            // req.file logs:{"fieldname":"upload_file","originalname":"refund.txt","encoding":"7bit","mimetype":"text/plain","destination":"./public/uploads/","filename":"upload_file-1521115553143-refund.txt","path":"public/uploads/myfile-1521114989588","size":0}
            if (req.file == undefined) {
                res.render('upload', { msg: 'no file selected' })
            } else {
                res.render('upload', { msg: `${req.file.originalname} uploaded successfully!` })
            }
        }
    })
})


app.listen(3001, () => {
    console.log('server on 3001');
})