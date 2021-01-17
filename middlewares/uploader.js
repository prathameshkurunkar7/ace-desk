const multer = require('multer');
const sharp = require('sharp');
const HttpError = require('../utils/http-error');

// handling pdf,csv files
const multerStorageFiles = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null,'uploads/files')
    },
    filename: (req,file,cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null,`${file.fieldname}-${Date.now()}.${ext}`);
    },
})

const multerFilterFiles = (req,file,cb) =>{
    if(file.mimetype === 'application/pdf' || file.mimetype === 'text/csv'){
        cb(null,true);
    }else{
        cb(new HttpError('Not an valid MIMETYPE',400),false)
    }
};


// handling images
const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new HttpError('Not an valid MIMETYPE',400),false)
    }
};

const imageUpload = multer({
    limits:500000,
    storage:multerStorage,
    fileFilter: multerFilter
});

const fileUpload = multer({
    limits:500000,
    storage: multerStorageFiles,
    fileFilter: multerFilterFiles
})

const resizeImage = (req,res,next) =>{
    if(!req.file) return next();
    req.file.fileName = `${req.file.fieldname}-${Date.now()}.jpeg`;
    req.file.path = `uploads/images/${req.file.fileName}`

    sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:95}).toFile(`uploads/images/${req.file.fileName}`)
    next();
}

exports.imageUpload = imageUpload.single('image');
exports.fileUpload = fileUpload.single('file');
exports.resizeImage = resizeImage;