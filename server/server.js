require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const path = require('path');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://127.0.0.1:27017/tUser", { useNewUrlParser: true, useUnifiedTopology: true });
app.use('/images', express.static(path.join(__dirname, 'upimages')));

const api_key = process.env.API_KEY;


const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    googleName: String,
    googleId: String,
    facebookId: String,
    picture: String,
});
const tShema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'TUser', required: true },
    pics: { type: mongoose.Schema.Types.ObjectId, ref: 'TUser', required: true },
    contpics: { type: String, required: false },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TUser' }],
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TUser' }],
});
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'TUser', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'TUser', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'TUser', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
});

const personalInfoSchema = new mongoose.Schema({
    name: String,
    location: String,
    bio: String,
    dob: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'TUser', required: true },
    joinedDate: { type: Date, default: Date.now },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TUser' }]
});

//userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

userSchema.add({
    personalInfo: personalInfoSchema
});

const User = new mongoose.model("User", tShema);
const TUser = new mongoose.model("TUser", userSchema);
const Message = new mongoose.model('Message', messageSchema);
const Comment = new mongoose.model('Comment', commentSchema);
const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);
//passport.use(TUser.createStrategy());


passport.serializeUser(function (tuser, done) {
    done(null, tuser.id);
});

passport.deserializeUser(function (id, done) {
    TUser.findById(id)
        .then(function (tuser) {
            done(null, tuser);
        })
        .catch(function (err) {
            done(err, null);
        });
});




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: process.env.GOOGLE_USER_PROFILE_URL
    
},


    //findOrCreate
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        const email = profile.emails[0].value;
        const image = profile.photos[0].value;
        TUser.findOrCreate({ googleId: profile.id, password: profile.id, username: profile.displayName, googleName: profile.displayName, email: email, picture: image }, function (err, user) {
            return cb(err, user);
        });
    }
));

//EAAFHOK9s2jMBOxBtvgzr0cMFF06cseipB2YXhN9TnTFTA8Qg3N7vTGZCy6JOVpnnlfRfVp6JBWuSDm5ZAZC0EcxTYnZBWllT4GZCfXiXwvBtCmJAGdzIxkYyZBHA5bPxrtk0RRXv41tlY1u7G3iKBKTezyhU0MThidZCG0e0bg08inmySK7frQ3DrapW1ZA9LfZA5hZAQy5RjCCsVpRJXf5qAXwwZBVLIb4UPxOw09tkw1h1AYjRuB8AU0ZBpCsr2DtZBHawuEJGZA0QZDZD
passport.use(new FacebookStrategy({
    //
    //
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACKURL,
    profileFields: ['id', 'emails', 'displayName', 'photos']
}, function (accessToken, refreshToken, profile, cb) {
    // Verify or create user logic here
    // For example:
    const email = profile.emails[0].value;
    const image = profile.photos[0].value;
    TUser.findOrCreate({ facebookId: profile.id, username: profile.displayName, email: email, picture: image }, function (err, user) {
        return cb(err, user);
    });
}));





app.get('/confirm-check', (req, res) => {
    if (req.isAuthenticated()) {
        TUser.findById(req.user._id)
            .then((foundUser) => {
                if (foundUser) {
                    res.redirect("http://localhost:3000/home");
                } else {
                    // User does not exist, redirect to register
                    res.redirect("http://localhost:3000/register");
                }
            })
            .catch((err) => {
                console.log(err);
                res.redirect("http://localhost:3000/register");
            });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user.username);
        res.json({ loggedIn: true, user: req.user.username, image: req.user.picture, id: req.user._id });
        //res.redirect("http://localhost:3000/home");
    } else {
        res.json({ loggedIn: false });
    }
});

///////////////////////////////////////

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../src/upimages/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
})

const upload = multer({ storage: storage })

app.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        console.log(req.body);
        const imageName = req.file.filename;
        res.json({ imageName: imageName });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).send("Internal Server Error");
    }
});

//////////


app.get('/gval', async (req, res) => {
    try {
        const personalInfo = await TUser.find({}, { _id: 1, personalInfo: 1 });
        const foundUsers = await User.find({}, { user: 1, pics: 1, likes: 1, content: 1, contpics: 1 })
            .populate('user', 'username')
            .populate({
                path: 'pics',
                select: 'picture'
            });

        if (foundUsers.length > 0) {
            const result = [];
            foundUsers.forEach(({ _id, user, pics, content, contpics, likes }) => {
                const userPersonalInfo = personalInfo.find(info => info._id.toString() === user._id.toString());
                result.push({
                    id: _id,
                    username: user.username,
                    picture: pics.picture,
                    uId: user._id,
                    content,
                    contpics,
                    likes,
                    personalInfo: userPersonalInfo ? userPersonalInfo.personalInfo : null
                });
            });
            res.json(result);
        } else {
            throw new Error("Users Not Found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/gval", upload.single("newimage"), async (req, res) => {
    const username = req.body.newname;
    const content = req.body.newDesc;
    const newImage = req.file;
    console.log(username);
    console.log(newImage);
    try {
        // const imageName = req.file.filename;
        //let tweetId = uuidv4();
        let imageName;
        if (req.file) {
            imageName = req.file.filename;
            console.log(imageName);
        }
        const user = await TUser.findOne({ username: username });
        console.log(user._id);
        if (user) {
            const newUser = new User({
                user: user._id,
                pics: user._id,
                content: (content) ? content : " ",
                contpics: imageName,
            });

            await newUser.save();
            res.status(200).json({ message: "Data saved successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});
app.get("/updateLikes", async (req, res) => {
    User.find({}, { user: 1, content: 1, likes: 1 })
        .then((foundUser) => {
            if (foundUser) {
                const result = foundUser.map(({ _id, likes }) => ({
                    id: _id,
                    likes
                }));
                res.json(result);
            }
            else {
                throw new Error("USers Not Found")
            }
        })
        .catch((err) => {
            res.json({ "message": err })
        })
})
app.post("/updateLikes", async (req, res) => {
    const tweetId = req.body.tweetId; // Assuming you have the tweetId in the request body
    const username = req.body.username; // Assuming you are using passport and the user is authenticated
    //const user = req.user._id;
    console.log(tweetId + " " + username);
    try {
        const user = await TUser.findOne({ "username": username })
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const tweet = await User.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        console.log(tweet);
        const alreadyLikedIndex = tweet.likes.indexOf(user._id);
        if (alreadyLikedIndex !== -1) {
            // If the user has already liked the tweet, remove their like
            tweet.likes.splice(alreadyLikedIndex, 1);
        } else {
            // If the user has not liked the tweet, add their like
            tweet.likes.push(user._id);
        }

        // Save the updated tweet
        await tweet.save();

        res.status(200).json({
            message: "Likes updated successfully",
            tweet: {
                _id: tweet._id,
                likes: tweet.likes,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/updateRepost", async (req, res) => {
    User.find({}, { user: 1, content: 1, retweets: 1 })
        .then((foundUser) => {
            if (foundUser) {
                const result = foundUser.map(({ _id, retweets }) => ({
                    id: _id,
                    retweets
                }));
                res.json(result);
            }
            else {
                throw new Error("USers Not Found")
            }
        })
        .catch((err) => {
            res.json({ "message": err })
        })
})
app.post("/updateRepost", async (req, res) => {
    const tweetId = req.body.tweetId; // Assuming you have the tweetId in the request body
    const username = req.body.username; // Assuming you are using passport and the user is authenticated
    //const user = req.user._id;
    console.log(tweetId + " " + username);
    try {
        const user = await TUser.findOne({ "username": username })
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const tweet = await User.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        console.log(tweet);
        const alreadyTweetIndex = tweet.retweets.indexOf(user._id);
        if (alreadyTweetIndex !== -1) {
            // If the user has already liked the tweet, remove their like
            tweet.retweets.splice(alreadyTweetIndex, 1);
        } else {
            // If the user has not liked the tweet, add their like
            tweet.retweets.push(user._id);
        }

        // Save the updated tweet
        await tweet.save();

        res.status(200).json({
            message: "Likes updated successfully",
            tweet: {
                _id: tweet._id,
                retweets: tweet.retweets,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/getTweets", async (req, res) => {
    User.find({}, { pics: 1, content: 1, contpics: 1, likes: 1 })
        .populate('user', 'username')
        .populate({
            path: 'pics',
            select: 'picture'
        })
        .then((foundusers) => {
            if (foundusers) {
                const result = foundusers.map(({ user, pics, content, contpics, likes }) => ({
                    userId: user._id,
                    userName: user.username,
                    picture: pics.picture,
                    content,
                    contpics,
                    likes,
                }));
                res.json(result);
                //console.log(result);
            }
            else {
                throw new Error("USers Not Found")
            }
        })
        .catch((err) => {
            console.log(err);
        })
});
app.post("/getTweets", async (req, res) => {
    const userName = req.body.userId;
    console.log(userName);
    const user = await TUser.findOne({ username: userName });

    //User.find({ "user": user._id })
    User.find({ "user": user._id }, { pics: 1, content: 1, contpics: 1, likes: 1, retweets: 1, user: 1, _id: 1 })
        .populate('user', 'username')
        .populate({
            path: 'pics',
            select: 'picture'
        })
        .then((foundusers) => {
            if (foundusers) {
                const result = foundusers.map(({ pics, content, contpics, likes, retweets, user, _id }) => ({
                    picture: pics.picture,
                    content,
                    contpics,
                    likes: likes.some(like => like._id.toString() === user._id.toString()),
                    retweets: retweets.some(retweet => retweet._id.toString() === user._id.toString()),
                    userId: user._id,
                    tweetId: _id,
                }));
                res.json(result);
                console.log(result);
            }
            else {
                throw new Error("USers Not Found")
            }
        })
        .catch((err) => {
            console.log(err);
        })
    console.log(userName);
})
app.get('/post-comment', async (req, res) => {
    try {
        const comments = await Comment.find({});
        const populatedComments = await Promise.all(comments.map(async (comment) => {
            const user = await TUser.findById(comment.user); // Find the user by userId in Comment schema
            if (user) {
                return {
                    tweet: comment.tweet,
                    text: comment.text,
                    username: user.username
                };
            } else {
                return {
                    tweet: comment.tweet,
                    text: comment.text,
                    username: 'Unknown' // Provide a default value if user not found
                };
            }
        }));
        res.json(populatedComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/post-comment', async (req, res) => {
    const userName = req.body.username;
    const tweetId = req.body.tweetId;
    const comment = req.body.comment;
    const user = await TUser.findOne({ username: userName });
    console.log(user._id);
    console.log(tweetId);
    try {
        if (user) {
            const newComment = new Comment({
                user: user._id,
                tweet: tweetId,
                text: comment,
                username: user,
            });
            await newComment.save();
            res.status(200).json({ comment: newComment });
        }
        else {
            res.status(404).json({ error: "Comment not found" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    //comments.push(comment);

    // Send the added comment back to the client
});
// Update the '/send' endpoint to store messages between users

app.get('/get', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
                apiKey: api_key
            }
        });
        res.json(response.data); // Send the fetched data as the response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/send', async (req, res) => {
    const { sender, receiver, text } = req.body;

    try {
        const newMessage = new Message({ sender, receiver, text });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post("/updatePersonalInfo", async (req, res) => {
    const userName = req.body.userId;
    const location = req.body.location;
    const dob = req.body.dob;
    const username = req.body.username;
    console.log(userName);
    try {
        const user = await TUser.findOne({ "username": userName });
        const userId = user._id.toString();
        if (!user.personalInfo) {
            user.personalInfo = new PersonalInfo();
        }
        if (username) {
            user.personalInfo.name = username;
        }
        if (location) {
            user.personalInfo.location = location;
        }
        if (dob) {
            user.personalInfo.dob = dob;
        }
        user.personalInfo.user = userId;
        await user.personalInfo.save();
        await user.save();
        res.status(200).json({ message: "Personal info updated successfully", user });
        // const newInfo = new PersonalInfo({
        //     uId:userId,
        //     name:username,
        //     location:location,
        //     dob:dob,
        // });
        //     await user.save();
        //     res.status(200).json({ message: "Personal info updated successfully", user });
        // }
        // else {
        //     res.status(404).json({ error: "not found" });
        // }
        // user.personalInfo.location = location;
        // user.personalInfo.dob = dob;
        // await user.save();

        //res.status(200).json({ message: "Personal info updated successfully" });//,user
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Add an endpoint to retrieve messages between two users


app.get('/auth/google',
    passport.authenticate('google', { scope: ["profile", "email"] })
);
app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] })
);
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/confirm-check');
    });
app.get("/auth/google/secrets",
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/register' }),
    function (req, res) {
        res.redirect('/confirm-check');
    });



app.get("/secrets", function (req, res) {
    TUser.find({ "email": "ff@gmail.com" })
        .then((foundUsers) => {
            if (foundUsers) {
                //res.render("secrets", { usersWithSecrets: foundUsers });
                res.json({ foundUsers });
            }
        })
        .catch((err) => {
            console.log(err);
        });

});


app.get("/submit", function (req, res) {
    if (req.isAuthenticated()) {
        res.send("Correct");
    } else {
        res.send("dcorrect");
    }
})

// app.post("/submit", function (req, res) {
//     const submittedSecret = req.body.secret;

//     console.log(req.user.id);

//     User.findById(req.user.id)
//         .then((foundUser) => {
//             if (foundUser) {
//                 foundUser.secret = submittedSecret;
//                 return foundUser.save(); // Return the promise from save
//             }
//             else {
//                 throw new Error("User not found");
//             }
//         })
//         .then(() => {
//             res.json({ uuser: req.body.secret })
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });


app.get("/logout", function (req, res) {
    req.logout((err) => {
        if (err) {
            console.log(err);
            res.json({ message: err });
        } else {
            res.redirect("/register");
        }
    });
});

app.get('/register', (req, res) => {
    TUser.find()
        .then((foundUser) => {
            if (foundUser) {
                res.json(foundUser);
            }
            else {
                throw new Error("USers Not Found")
            }
        })
        .catch((err) => {
            console.log(err);
        })
});
app.post("/register", function (req, res) {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }
    TUser.findOneAndUpdate(
        { email: email }, // Find user by email
        { username: username }, // Update username
        { new: true, upsert: true } // Return updated document, create if not found
    )
        .then((updatedUser) => {
            res.status(200).json({ message: "User registered/updated successfully", user: updatedUser });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

app.get('/login', (req, res) => {
    //   const { username,email, password } = req.body;
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, user: req.user.username, image: req.user.picture, id: req.user._id });
        //res.redirect("http://localhost:3000/home");
    }
    else {
        res.json({ loggedIn: false });
    }
});
app.post("/login", async function (req, res) {
    const { username, email } = req.body;
    try {
        const user = await TUser.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Here you should implement password verification logic
        // For simplicity, I'll compare passwords in plain text (not recommended for production)
        if (user) {
            // Authentication successful
            req.login(user, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                // Redirect to the check-auth endpoint after successful login
                res.status(200).json({ message: "Login successful" });
            });
        } else {
            // Incorrect password
            return res.status(401).json({ error: "Incorrect password" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/adddetails", function (req, res) {
    if (req.isAuthenticated()) {
        console.log("true");
        TUser.findById(req.user._id)
            .select('username email')
            .then((founduser) => {
                console.log("true");
                res.json(founduser);
            })
            .catch(err => {
                console.log(err);
            })
    }
    else {
        res.json({ loggedIn: false });
    }
    // const user = req.params.userId;

})

app.listen(5000, () => {
    console.log("Server is running");
});


