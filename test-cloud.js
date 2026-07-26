const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fs = require('fs');

async function run() {
  fs.writeFileSync('test.pdf', '%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
  
  cloudinary.uploader.upload('test.pdf', { resource_type: 'raw', public_id: `test_${Date.now()}.pdf` }, (err, result) => {
    console.log('RAW URL:', result?.url, err);
  });

  cloudinary.uploader.upload('test.pdf', { resource_type: 'image', format: 'pdf' }, (err, result) => {
    console.log('IMAGE URL:', result?.url, err);
  });
}
run();
