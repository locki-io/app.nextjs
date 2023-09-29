// api/user.js
import { users } from '../../db/data.json';

// Import the required types from Next.js
import { NextApiRequest, NextApiResponse } from 'next'

// If your users data is coming from an external module, don't forget to import it
// import { users } from 'path-to-your-users-data'

// Define your API route handler with TypeScript types
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;
  
  // Assuming `users` is an array of objects and each object has a `username` property.
  // You might need to adjust the type of `users` and `user` to match your actual data structure.
  const user = users.find(user => user.username === username);
  
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  
  res.status(200).json(user);
}
// In this revised function:

//The req and res parameters are now typed with NextApiRequest and NextApiResponse, respectively.
//The handler function is annotated to return void, since it doesn't return anything.
//If your users data comes from an external module, make sure to import it at the top of your file.
//The comment about the users and user types is a reminder to ensure that these types reflect your actual data structure. If your data structure is different, you may need to define and use appropriate TypeScript types or interfaces.
//This should give you a good starting point for using TypeScript with your API route handlers in Next.js.





