const express = require('express');
const router = express.Router();
const User=require("../models/user")



const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//nodemailer //nodemailer //nodemailer //nodemailer 
const nodemailer=require('nodemailer');
/*
var transporter =nodemailer.createTransport({
service:'gmail',
//administrateur 
auth:{
user:process.env.GMAIL_USER,
pass:process.env.GMAIL_PASS
},
tls:{
rejectUnauthorized:false
}
}) */
//nodemailer //nodemailer //nodemailer //nodemailer 

//     alternative que nodemailer au lieu de /* .ci avant on remplace..*/ on peux essaie avec  ethereal.email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});
// ou on peux essaie avec  ethereal.email






// créer un nouvel utilisateur // créer un nouvel utilisateur // 
router.post('/register', async (req, res) => {
try {
let { email, password, firstname, lastname } = req.body
const user = await User.findOne({ email })
if (user) return res.status(404).send({ success: false, message:
"User already exists" })
const newUser = new User({ email, password, firstname, lastname })
const createdUser = await newUser.save()





//nodemailer
// Envoyer l'e-mail de confirmation de l'inscription
var mailOption ={
from: '"verify your email " <bradaimaha96@gmail.com>',
to: newUser.email,
subject: 'vérification your email ',
html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
<h4>please verify your email to procced.. </h4>
<a
href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click
here</a>`
}
transporter.sendMail(mailOption,function(error,info){
if(error){
console.log(error)
}
else{
console.log('verification email sent to your gmail account ')
}
})
//nodemailer









//twilio //twilio  //twilio  //twilio  //twilio  //twilio   //twilio




const sid = process.env.SID;
const auth_token = process.env.AUTH_TOKEN;



var twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.acceptApointments = async (req, res) => {
  try {
    twilio.messages.create({
      from: process.env.TWILIO_FROM,
      to: process.env.TWILIO_TO,
      body: "your appointment has benn accepted "
    })
    .then((res) => console.log('message sent'))
    .catch((err) => { console.log(err) });
  } catch (error) {
    console.log("zeae");
    console.log(error);
  }
}



//https://dashboard.nexmo.com/getting-started/sms


const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

const from = process.env.VONAGE_FROM;
const to = process.env.VONAGE_TO;
const text = process.env.VONAGE_TEXT;

async function sendSMS() {
  await vonage.sms.send({ to, from, text })
    .then(resp => {
      console.log('Message sent successfully');
      console.log(resp);
    })
    .catch(err => {
      console.log('There was an error sending the messages.');
      console.error(err);
    });
}

sendSMS();


//twilio //twilio  //twilio  //twilio  //twilio  //twilio   //twilio










return res.status(201).send({ success: true, message: "Accountcreated successfully", user: createdUser })
} catch (err) {
console.log(err)
res.status(404).send({ success: false, message: err })
}
});

// créer un nouvel utilisateur // créer un nouvel utilisateur // 


//* as an admin i can disable or enable an account  nodemailer

router.get('/status/edit/', async (req, res) => {
try {
let email = req.query.email
console.log(email)
let user = await User.findOne({email})
user.isActive = !user.isActive
user.save()
res.status(200).send({ success: true, user })
} catch (err) {
return res.status(404).send({ success: false, message: err })
}
})
//* as an admin i can disable or enable an account  nodemailer






// afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
try {
const users = await User.find().select("-password");
res.status(200).json(users);
} catch (error) {
res.status(404).json({ message: error.message });
}

});

/**
* as an admin i can disable or enable an account
*/
router.get('/status/edit/', async (req, res) => {
try {
let email = req.query.email
let user = await User.findOne({email})
user.isActive = !user.isActive
user.save()
res.status(200).send({ success: true, user })
} catch (err) {
return res.status(404).send({ success: false, message: err })
}
})




// Generate token    // Generate token

const generateToken = (user) => {
return jwt.sign({ user }, process.env.TOKEN, { expiresIn: '60s' });
};


// Generate token    // Generate token



// se connecter // se connecter  // se connecter


// Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) {
return res.status(404).send({ success: false, message: "All fields arerequired" });
}
const user = await User.findOne({ email });
if (!user) {
return res.status(404).send({ success: false, message: "Account doesn'texist" });
}
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(400).json({ success: false, message: 'Please verify yourcredentials' });
}
const token = generateToken(user);
const refreshToken = generateRefreshToken(user);
res.status(200).json({
success: true,
token,
refreshToken,
user,
isActive: user.isActive
});
} catch (error) {
res.status(404).json({ message: error.message });
}
});


// Refresh token
const generateRefreshToken = (user) => {
return jwt.sign({ user }, process.env.REFRESH_TOKEN, { expiresIn: '1y' });
};
router.post('/refreshToken', async (req, res) => {
const refreshToken = req.body.refreshToken;
if (!refreshToken) {
return res.status(404).json({ success: false, message: 'Token Not Found' });
}
jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
if (err) {
return res.status(406).json({ success: false, message: 'Unauthorized Access' });
}
const token = generateToken(user);
const newRefreshToken = generateRefreshToken(user);
res.status(200).json({
token,
refreshToken: newRefreshToken
});
});
});


// se connecter // se connecter  // se connecter


// login pour client
const getuserBYEmailClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Client introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email ou mot de passe invalide" });
    }

    const token = jwt.sign({ user }, process.env.TOKEN, { expiresIn: '60s' });
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post('/loginclient', getuserBYEmailClient);



module.exports = router;  