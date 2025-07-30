import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

// Multer config
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

// Process and save image
export const processImage = async (
  file: Express.Multer.File,
  outputPath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): Promise<string> => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
    file.originalname
  )}`;
  const filepath = path.join(outputPath, filename);

  // Ensure directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Process image with sharp
  await sharp(file.buffer)
    .resize(options?.width || 800, options?.height || 800, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: options?.quality || 90 })
    .toFile(filepath);

  return filename;
};
