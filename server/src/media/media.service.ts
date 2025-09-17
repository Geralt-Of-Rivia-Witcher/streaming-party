import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  private s3: S3Client;
  private readonly bucket = 'media-content-streaming-party';

  constructor() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials are not set in environment variables');
    }

    this.s3 = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private async getFileMetadata(key: string): Promise<{
    contentLength?: number;
    contentType?: string;
    lastModified?: Date;
  }> {
    const command = new HeadObjectCommand({ Bucket: this.bucket, Key: key });
    const response = await this.s3.send(command);
    return {
      contentLength: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
    };
  }

  private async getSignedUrl(
    key: string,
    expiresInSeconds: number,
    contentType: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: 'inline',
      ResponseContentType: contentType,
    });
    return await getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async getMediaSignedUrl(fileName: string): Promise<string> {
    const encoded = encodeURIComponent(fileName);
    const fileMetadata = await this.getFileMetadata(encoded);
    if (!fileMetadata.contentLength || !fileMetadata.contentType) {
      throw new Error('content length unknown');
    }
    const signedUrl = await this.getSignedUrl(
      fileName,
      3 * 60 * 60, // 3 hours
      fileMetadata.contentType,
    );
    return signedUrl;
  }
}
