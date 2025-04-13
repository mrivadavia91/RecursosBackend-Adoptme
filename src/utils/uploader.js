
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = '';

    if (file.fieldname === 'profile' || file.fieldname === 'document') {
      folder = 'documents';
    } else if (file.fieldname === 'petImage') {
      folder = 'pets';
    } else {
      folder = 'others';
    }

    const dest = path.join('uploads', folder);

    fs.mkdirSync(dest, { recursive: true });

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const uploader = multer({ storage });

export default uploader;
