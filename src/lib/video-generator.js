/**
 * Converts an image buffer to a 5-second video file (MP4).
 * Uses dynamic import to load ffmpeg modules only when needed.
 * 
 * @param {Buffer} imageBuffer - The buffer of the source image.
 * @param {string} tempFilename - A unique base name for temporary files.
 * @returns {Promise<string>} - The path to the generated video file.
 */
export async function convertImageToVideo(imageBuffer, tempFilename) {
    // Dynamic imports to avoid module loading issues
    const ffmpeg = (await import('fluent-ffmpeg')).default;
    const ffmpegPath = (await import('ffmpeg-static')).default;
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');

    // Set the path to the ffmpeg binary
    if (ffmpegPath) {
        ffmpeg.setFfmpegPath(ffmpegPath);
    }

    const tempDir = os.tmpdir();
    const imagePath = path.join(tempDir, `${tempFilename}.jpg`);
    const videoPath = path.join(tempDir, `${tempFilename}.mp4`);

    // Write image buffer to temp file
    await fs.promises.writeFile(imagePath, imageBuffer);

    return new Promise((resolve, reject) => {
        ffmpeg(imagePath)
            .loop(5) // Create a 5-second loop
            .fps(25) // 25 frames per second
            .videoCodec('libx264') // H.264 codec
            .format('mp4')
            .outputOptions([
                '-pix_fmt yuv420p', // Ensure compatibility with most players
                '-shortest'         // Stop when the shortest input (loop duration) ends
            ])
            .on('end', () => {
                // Return path to video
                resolve(videoPath);
                // Clean up image file asynchronously
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Failed to delete temp image:', err);
                });
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                reject(err);
                // Clean up image file on error too
                fs.unlink(imagePath, () => { });
            })
            .save(videoPath);
    });
}
