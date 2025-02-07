import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse form-data request with formidable
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'temp'); // Temporary storage
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    const file = files.file; // Get the uploaded file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Read file and send it to FastAPI backend
      const fileData = fs.readFileSync(file.filepath);
      const formData = new FormData();
      formData.append('file', new Blob([fileData]), file.originalFilename);

      const response = await fetch('http://127.0.0.1:8100/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return res.status(response.status).json(result);
    } catch (error) {
      console.error('Error sending file to backend:', error);
      return res.status(500).json({ error: 'Failed to send file to backend' });
    } finally {
      fs.unlinkSync(file.filepath); // Remove temp file
    }
  });
}
