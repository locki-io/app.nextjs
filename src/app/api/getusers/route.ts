/**
 * @swagger
 * /api/getUsers:
 *   get:
 *     description: Returns the users
 *     responses:
 *       200:
 *         description: users returned!
 */
import { users } from '../../../db/data.json';

// Importing necessary types and modules
import { NextApiRequest, NextApiResponse } from 'next';

// Async handler function
export async function GET(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Ensure the HTTP method is GET
  console.log(users);
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });  // Only GET method is allowed
    return;
  }
  try {
    // Return the user data
    return res.status(200).json(users);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}






