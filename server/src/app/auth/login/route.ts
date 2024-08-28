// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//     const baseUrl = request.headers.get('origin');
//     const formData = await request.formData();

//     const username = formData.get('username');
//     const password = formData.get('password');

//     // authenticate user here and set authentication token in the cookie

//     const headers = new Headers(request.headers);
//     headers.set("Set-Cookie", "token=authenticated; Path=/; HttpOnly");

//     return NextResponse.redirect(baseUrl!, { status: 303, headers: headers });
// }



import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';


dotenv.config();

const dummyUser = {
  username: 'testuser',
  password: '$2y$10$60Scmad9zdA1wNMsg3o9PeqhvN7U78BaMxoVbCTHDx.DqazRSLD5q',
  useRole: 'user',
};


const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: 'Username and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (
      username === dummyUser.username &&
      bcrypt.compareSync(password, dummyUser.password)
    ) {
      const token = jwt.sign(
        { username: username, useRole: dummyUser.useRole },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION } 
      );
      return new Response(
        JSON.stringify({ token }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
