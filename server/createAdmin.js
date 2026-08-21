const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");


    const adminEmail = "admin@gmail.com";
    const adminPassword = "Admin@12345";


    const existingUser = await User.findOne({
      email: adminEmail
    });


    if(existingUser){
      console.log("⚠️ Admin already exists");
      process.exit();
    }


    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );


    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });


    console.log("✅ Admin Created Successfully");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);


    process.exit();


  } catch(error){

    console.log("❌ Error:", error.message);
    process.exit();

  }

};


createAdmin();