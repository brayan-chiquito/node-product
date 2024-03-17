const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductContrller = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductContrller.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductContrller.products_create_product);

router.get('/:productId', ProductContrller.products_get_product);

router.patch('/:productId', checkAuth, ProductContrller.products_update_product);

router.delete('/:productId', checkAuth, ProductContrller.products_delete_product);

module.exports = router;