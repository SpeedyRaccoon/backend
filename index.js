const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Dotenv = require("dotenv").config(); //create a .env file containing the passwords if running code locally
const connection = "mongodb+srv://kevintang01:" + process.env.M_PASSWORD + "@lahacks.gihcnf6.mongodb.net/?"

const transporter = nodemailer.createTransport( {
    service: "Zoho",
    auth: {
        user: "che@tang-se.com",
        pass: process.env.E_PASSWORD
    }
});

const connectDB = async () => {
    mongoose.set('strictQuery', false);
  
    await mongoose
        .connect (connection)
            .then(() => console.log("Connected to DB"))
            .catch(console.error);
  }
  
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(express.json())
  
  connectDB().then(() => {
    app.listen(8080, () => {console.log("Server listening on port 8080");});
  })

const Email = require("./models/email");
const Address = require("./models/address");

app.post('/sendemail', async (req, res) => {
    const message = "Dear Che,\n" + 
        "\nYou received a message from a customer. Below are the details:\n\n"
        + "Client: " + req.body.name + "\n"
        + "Email: " + req.body.email + "\n"
        + "Message:\n" + req.body.message;

    const options = {
        from: "tnthome@zohomail.com",
        to: ["che@tang-se.com", "kevin@tang-se.com", "che@lovadu.com"],
        subject: "LOV ADU - New Message",
        text: message,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(options, function (err, info){
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve("email sent");
            }
        });
    });

    let ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    if (ipaddress.indexOf(',') === -1)
    {
        ipaddress = ipaddress.substring(0, ipaddress.length);
    }
    else
    {
        ipaddress = ipaddress.substring(0, ipaddress.indexOf(','));
    }
    const newPost = new Email({
        email: req.body.email,
        address: ipaddress,
        timestamp: Date.now(),
        message: true,
    })

    newPost.save();

    res.json(0);
});

app.post('/subscribe', async (req, res) => {

    // let ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    // if (ipaddress.indexOf(',') === -1)
    // {
    //     ipaddress = ipaddress.substring(0, ipaddress.length);
    // }
    // else
    // {
    //     ipaddress = ipaddress.substring(0, ipaddress.indexOf(','));
    // }
    const newPost = new Email({
        email: req.body.email,
        // address: ipaddress,
        timestamp: Date.now(),
        message: false,
    })

    newPost.save();
    res.json(0);
})

app.get('/mainlogo', async (req, res) => {
    let ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    if (ipaddress.indexOf(',') === -1)
    {
        ipaddress = ipaddress.substring(0, ipaddress.length);
    }
    else
    {
        ipaddress = ipaddress.substring(0, ipaddress.indexOf(','));
    }
    const addressSearch = await Address.findOne({address: ipaddress});
    if (addressSearch === null)
    {
        const newPost = new Address({
            address: ipaddress,
            timestamp: [Date.now()],
        })
        newPost.save();
    }
    else
    {
        if (addressSearch.timestamp.length % 2 === 1)
        {
            addressSearch.timestamp.push(Date.now());
        }
        else if (Date.now() - addressSearch.timestamp[addressSearch.timestamp.length - 1] > 300000)
        {
            addressSearch.timestamp.push(Date.now());
        }
        else
        {
            addressSearch.timestamp[addressSearch.timestamp.length - 1] = Date.now();
        }
        
        const post = await Address.findByIdAndUpdate(addressSearch.id, {
            address: addressSearch.address,
            timestamp: addressSearch.timestamp,
        }, { new: true });
        post.save();
    }
    // require('fs').createReadStream('icon.png').pipe(res);
    res.json("")
})