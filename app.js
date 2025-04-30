const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const userModel = require('./models/user');
const postModel = require('./models/post');
const upload = require('./config/multerconfig');
const port = process.env.PORT||3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
require('dotenv').config();

app.set('view engine','ejs');


app.get('/', async (req, res) => {
    let loggedInUser = Boolean(req.cookies.token);
    // console.log(loggedInUser);
    let posts = await postModel.find().populate('user');
    if(req.cookies.token){
        let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({_id: data.userid});
        res.render('index', {posts, loggedInUser, userid: data.userid, user});
    }
    else{
        res.render('index', {posts, loggedInUser, userid: null});
    }
})

app.get('/register', (req, res) => {
    res.render('register');
})


app.post('/register', async (req, res) => {
    let {name, username, email, age, password} = req.body;
    let emailExist = await userModel.findOne({email});
    if(emailExist) return res.status(409).send("User already registered with this email!");

    let usernameExist = await userModel.findOne({username});
    if(usernameExist) return res.status(409).send("Username already taken!");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                name,
                username,
                email,
                age,
                password: hash
            })

            let token = jwt.sign({userid: createdUser._id, username}, process.env.JWT_KEY);
            res.cookie('token', token);
            res.redirect('/');
        })
    })

})

app.get('/login', (req, res) => {
    res.render('login');
})


app.post('/login', async (req, res) => {
    let {username, password} = req.body;
    let user = await userModel.findOne({username});

    if(!user) return res.send("Email or Password is incorrect!");

    bcrypt.compare(password, user.password, (err, result) => {
        if(!result){
            return res.send("Username or Password is incorrect!");
        }
        else{
            let token = jwt.sign({userid: user._id, username}, process.env.JWT_KEY);
            res.cookie('token', token);
            res.redirect("/");
        }
    })
})

app.get('/profile',isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({username: req.user.username}).populate('posts');// as posts contain id of a post not that actual post thats why we are using populate() function
    res.render("profile",{user});
})

app.post('/post',isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({username: req.user.username});
    
    let {content} = req.body;
    let post = await postModel.create({
        user: user._id,
        content
    })

    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
})

function isLoggedIn(req, res, next) {
    if(req.cookies.token){
        let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.user = data;
        next();
    }
    else{
        res.redirect('/login');
    }
}

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate('user');

    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect('/');
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate('user');
    res.render('edit', {post});
})

app.post('/update/:id', isLoggedIn, async (req, res) => {
    let {content} = req.body;
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content});
    res.redirect('/profile');
})


app.get('/upload/profilepic/:username', isLoggedIn,  async (req, res) => {
    let user = await userModel.findOne({username: req.params.username});
    res.render('profileupload', {user});
})

app.post('/upload', isLoggedIn, upload.single('image'),  async (req, res) => {
    let user = await userModel.findOneAndUpdate({_id: req.user.userid}, {profilepic: req.file.filename})
    res.redirect(`upload/profilepic/${req.user.username}`);
})

app.get('/user/:username', async (req, res) => {
    let user = await userModel.findOne({username: req.params.username}).populate('posts');
    if(req.cookies.token === ''){
        res.render('user', {user});
    }
    else{
        let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        if(data.username != req.params.username){
            res.render('user', {user});
        }
        else{
            res.render('profile', {user});
        }
    }
})

app.get('/logout', isLoggedIn,  (req, res) => {
    res.cookie('token', "");
    res.redirect('/');
})

app.listen(port);
