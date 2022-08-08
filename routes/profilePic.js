const express = require('express')
const multer  = require('multer')
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/
router.use(express.static(__dirname + '/public'));
router.use('/uploads', express.static('uploads'));

router.post('/', upload.single('profile-file'), function (req, res, next) {
    try {
         // req.file is the `profile-file` file
        // req.body will hold the text fields, if there were any
        console.log(JSON.stringify(req.file))
        let response = '<a href="/">Home</a><br>'
        response += "Files uploaded successfully.<br>"
        response += `<img src="${req.file.path}" /><br>`
        return res.send(response)
    } catch (error) {
        console.log(error.message);
    }
 
})

// router.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
//     // req.files is array of `profile-files` files
//     // req.body will contain the text fields, if there were any
//     var response = '<a href="/">Home</a><br>'
//     response += "Files uploaded successfully.<br>"
//     for(var i=0;i<req.files.length;i++){
//         response += `<img src="${req.files[i].path}" /><br>`
//     }
    
//     return res.send(response)
// })

module.exports = router;
   