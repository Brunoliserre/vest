import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Subir imagen a Cloudinary
 * @param file - Buffer del archivo
 * @param folder - Carpeta en Cloudinary (ej: 'products')
 * @returns URL pública de la imagen
 */
export async function uploadImage(
    file: Buffer,
    folder: string = 'ecommerce'
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' }, // Limitar tamaño
                    { quality: 'auto' }, // Optimización automática
                    { fetch_format: 'auto' }, // Formato automático (WebP si el navegador soporta)
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result!.secure_url);
                }
            }
        );

        uploadStream.end(file);
    });
}

/**
 * Eliminar imagen de Cloudinary
 * @param publicId - ID público de la imagen (extraído de la URL)
 */
export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

/**
 * Extraer public_id de una URL de Cloudinary
 * Ejemplo: https://res.cloudinary.com/demo/image/upload/v123/folder/image.jpg
 * Retorna: folder/image
 */
export function getPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
}