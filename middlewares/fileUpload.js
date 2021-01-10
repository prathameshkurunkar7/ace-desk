const multer = require('multer');
const sharp = require('sharp');
const HttpError = require('../utils/http-error');

// const multerStorage = multer.diskStorage({
//     destination: (req,file,cb)=> {
//         cb(null,'uploads/images')
//     },
//     filename: (req,file,cb)=>{
//         const ext = file.mimetype.split('/')[1];
//         cb(null,`${file.fieldname}-${Date.now()}.${ext}`);
//     },
// })
const multerStorage = multer.memoryStorage();


const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new HttpError('Not an valid MIMETYPE',400),false)
    }
};

const fileUpload = multer({
    limits:500000,
    storage:multerStorage,
    fileFilter: multerFilter
});

const resizeImage = (req,res,next) =>{
    if(!req.file) return next();
    req.file.fileName = `${req.file.fieldname}-${Date.now()}.jpeg`

    sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/images/${req.file.fileName}`)
    next();
}

exports.fileUpload = fileUpload.single('file');
exports.resizeImage = resizeImage;