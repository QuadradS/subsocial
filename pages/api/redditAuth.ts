import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  payload: boolean | string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const code = req.query.code;
  if(!code) {
    res.status(300).json({ payload: 'error_empty_code' })
  }

  // TODO move to global object
  const encodedHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: "POST",
    body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback`,
    headers: {authorization: `Basic ${encodedHeader}`, 'Content-Type': 'application/x-www-form-urlencoded'}
  })

  const body = await response.json();

  res.setHeader("set-cookie", `access_token=${body.access_token};`)
  res.status(200).json({ payload: true })
}
