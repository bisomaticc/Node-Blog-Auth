const express = require('express');
const app = express();
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/',forwardAuthenticated,(req,res)=>res.render('welcome'));
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user: req.user
    })
}
)

module.exports=router;