# quick-post
Certainly! Here's a comprehensive `README.md` for your [quick-post](https://github.com/Arabinda2004/quick-post) repository:

---

# Quick Post

**Quick Post** is a minimalist social media platform built with Node.js, Express, MongoDB, and EJS. It enables users to register, log in, create posts, like/unlike posts, and manage their profiles, including uploading profile pictures.

## 🚀 Features

- **User Authentication**: Register and log in securely using JWT tokens stored in cookies.
- **Post Creation**: Authenticated users can create text-based posts.
- **Like/Unlike Posts**: Users can like or unlike posts.
- **User Profiles**: View personal profiles with a list of created posts.
- **Profile Picture Upload**: Upload and update profile pictures using Multer.
- **Responsive UI**: Server-side rendered views using EJS templates.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer
- **Templating Engine**: EJS
- **Password Hashing**: bcrypt
- **Cookie Management**: cookie-parser

## 📂 Project Structure

```
quick-post/
├── config/
│   └── multerconfig.js
├── models/
│   ├── post.js
│   └── user.js
├── public/
│   └── [Static Assets]
├── views/
│   ├── edit.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── profileupload.ejs
│   ├── register.ejs
│   └── user.ejs
├── .env
├── app.js
├── package.json
└── README.md
```

## ⚙️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Arabinda2004/quick-post.git
   cd quick-post
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=your_mongodb_connection_string
   ```

   Replace `your_jwt_secret_key` with a secure secret key for JWT and `your_mongodb_connection_string` with your MongoDB connection string.

4. **Start the server:**

   ```bash
   node app.js
   ```

   The application will run on `http://localhost:3000`.


## 📄 License

This project is licensed under the MIT License.

---

Feel free to customize this `README.md` further to suit your project's needs. Let me know if you need assistance with anything else! 
