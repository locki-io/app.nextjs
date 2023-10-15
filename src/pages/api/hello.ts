/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns hello
 *     responses:
 *       200:
 *         description: Hello from Locki on Next.js!
 */
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
  }
interface ErrorResponseData extends ResponseData {
    error: string;
  }

export default function handler(
    req: NextApiRequest, 
    res: NextApiResponse<ResponseData>) {
        console.log('hello api called');
        try {
            if (req.method === 'POST') {
                res.status(200).json({ message: process.env.OPENAI_API_KEY || '' })
            } else {
                res.status(200).send({ message: process.env.OPENAI_API_KEY || '' })
            }
        } catch (err) {
            res.status(500).json({ error: "failed to load data" } as ErrorResponseData)
        }
  
}