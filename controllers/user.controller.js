const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const GoogleUsers = require("../models/GoogleUsers");

module.exports.allUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error, "Error");
    res.send("Inter Server Error");
  }
};

module.exports.singleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Users.find({ _id: id });

    res.status(200).json({
      status: "success",
      message: "Data find successfully!",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Data not find",
      error: error,
    });
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).send("Please fill all required fields");
    } else {
      const isAlreadyExist = await Users.findOne({ email });
      if (isAlreadyExist) {
        res.status(400).send("User already exists");
      } else {
        const newUser = new Users(req.body);
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        console.log(newUser.createdAt);
        const token = jwt.sign(
          { email: newUser.email, id: newUser._id },
          process.env.JWT_SECRET_KEY
        );
        return res.status(200).json({ newUser, token });
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { email } = req.body;
    const isAlreadyExist = await GoogleUsers.findOne({ email });
    if (isAlreadyExist) {
      res.status(400).send("User already exists");
    } else {
      const newUser = new GoogleUsers(req.body);
      newUser.save();
      res.status(200).json(newUser);
    }
  } catch (error) {
    console.log(error, "Error");
  }
}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (isPasswordValid) {
        const token = jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          process.env.JWT_SECRET_KEY
        );
        return res.status(200).json({
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          token,
          message: "Login successful",
        });
      } else {
        res.status(400).send("Invalid Password");
      }
    } else {
      res.status(400).send("Invalid Email");
    }
  } catch (error) {
    console.log(error, "Error");
    res.status(500).send("Something went wrong");
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      Object.assign(updateData, {
        userProfilePic: "/uploads/images/" + req.file.filename,
      });
    }

    const updateUser = await Users.findById(id);
    updateUser.set(updateData);

    // Find the user by ID and update the data
    const updatedUser = await Users.findByIdAndUpdate(id, updateUser, {
      new: true, // Returns the updated document
      runValidators: true, // Run Mongoose validators on the updated data
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

module.exports.checkEmailExists = async (req, res) => {
  const { email, uid } = req.query;

  try {
    if (!email && !uid) {
      return res.status(400).send("Please provide either an email or a UID.");
    }

    const query = {};
    if (email) {
      query.email = email;
    }
    if (uid) {
      query.uid = uid;
    }

    const user = await Users.findOne(query);

    if (user) {
      // User exists
      res.json({ exists: true });
    } else {
      // User does not exist
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).send("An error occurred while checking user existence.");
  }
};

module.exports.searchUsers = async (req, res) => {
  const { _id, query } = req.body;

  const capitalizedWord = query.charAt(0).toUpperCase() + query.slice(1);

  try {
    // Use a regular expression to perform a case-insensitive search
    const users = await Users.find({
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { email: { $regex: new RegExp(query, "i") } },
        { uid: { $regex: new RegExp(query, "i") } },
      ],
    });

    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }

    const global = users.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        tagLine: user.tagLine,
        bio: user.bio,
        uid: user.uid,
        country: user.country,
        isActive: user.isActive,
      };
    });

    // find a user from own followers list
    const ownDetails = await Users.findById(_id);

    const ownFollowers = ownDetails.followers;
    const ownLinked = ownDetails.linked;

    const followers = ownFollowers.filter((follower) =>
      follower.name.includes(capitalizedWord)
    );
    const linked = ownLinked.filter((link) =>
      link.name.includes(capitalizedWord)
    );

    res.status(200).json({
      status: "success",
      message: "Data find successfully!",
      query: query,
      global: global,
      followers: followers,
      linked: linked,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", err: err });
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Users.findByIdAndDelete(id);

    return res.json(deletedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
}