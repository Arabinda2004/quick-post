const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
// disksrorage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12, (err, bytes) => {
        const fileName = bytes.toString('hex') + path.extname(file.originalname); // path.extname(file.originalname) -> it will return the extension of the uploaded file
        cb(null, fileName);       
      })
    }
  })

// export upload variable
const upload = multer({ storage: storage });
module.exports = upload;