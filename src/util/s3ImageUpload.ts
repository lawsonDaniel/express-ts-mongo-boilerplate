import { BUCKET_NAME, s3Client } from "./config";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

export const uploadImageToS3 = async(base64Image:string )=>{
try{
    if(!base64Image){
        throw new Error('image not available')
    }
  const imageBuffer = Buffer.from(base64Image, "base64");
    // Process image with Sharp
    const optimizedImage = await sharp(imageBuffer)
      .resize(1200, 1200)
      .webp({ quality: 85 })
      .toBuffer();

    // Upload to S3
    const fileName = `image/-${uuidv4()}.webp`;
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: optimizedImage,
      ContentType: "image/webp",
      ACL: "public-read" as const, // Make the image publicly accessible
    }));

    return {
      url: `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`
    };
}catch(error:any){
throw new Error(error?.message || error)
}
}