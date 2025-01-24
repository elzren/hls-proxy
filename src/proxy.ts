import { Request, Response } from 'express';
import axios from "axios";

export const proxy = async (req: Request, res: Response) => {
    try {
        const proxyUrl = `${req.protocol}://${req.get('host')}`
        const url = req.query.url as string
        const baseUrl = new URL(url)
        const basePath = `${baseUrl.protocol}//${baseUrl.host}${baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1)}`;

        const isM3U8 = url.includes('m3u8')

        const response = await axios.get(url, {
            responseType: isM3U8 ? 'text' : 'stream'

        });
        let responseData = response.data
        const contentType = response.headers['content-type']

        if (!isM3U8) {
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Content-Type': contentType,
                'Content-Length': response.headers['content-length'],
                'Content-Range': response.headers['content-range'],
                'Accept-Ranges': 'bytes',
            });
            responseData.pipe(res);
        } else {
            responseData = responseData.replace(/URI=['"](.*?)['"]/, (_: string, url: string) => {
                const fullUrl = url.startsWith('http')
                    ? url
                    : url.startsWith('/')
                        ? `${baseUrl.protocol}//${baseUrl.host}${url}`
                        : `${basePath}${url}`;
                return `URI="${new URL(proxyUrl).origin}/proxy?url=${encodeURIComponent(fullUrl)}"`;
            });

            const modifiedData = responseData.replace(/^(?!#)([^\s]+)$/gm, (match: string) => {
                const fullUrl = match.startsWith('http')
                    ? match
                    : match.startsWith('/')
                        ? `${baseUrl.protocol}//${baseUrl.host}${match}`
                        : `${basePath}${match}`;
                return `${new URL(proxyUrl).origin}/proxy?url=${encodeURIComponent(fullUrl)}`;
            });

            res.set({
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Accept-Ranges': 'bytes',
            });
            res.send(modifiedData);
        }
    } catch (error: any) {
        console.error('Error in proxy:', error.message);
        res.set({
            'Access-Control-Allow-Origin': '*'
        })
        res.status(500)
        res.send(`Proxy error: ${error.message}`)
    }
}