import type { NextApiRequest, NextApiResponse } from 'next';
import {IPost} from "../../../store/posts";

type Data = {
  payload: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const accessToken = req.cookies.access_token;

  const search = req.query.search || 'React';
  const limit = req.query.limit || 20;

  try {
    const response = await fetch(`https://oauth.reddit.com/r/${search}/hot?limit=${limit}`, {
      method: "GET",
      headers: {authorization: `bearer ${accessToken}`},
    })

    const body = await response.json();

    const payload: IPost[] = body.data.children.map(({ data }: any) => ({
      id: data.id,
      author: data.author,
      selftext: data.selftext,
      subreddit: data.subreddit,
      title: data.title,
      url: data.url
    }))

    res.status(200).json({ payload: JSON.stringify(payload) })
  } catch (e) {
    console.log('LOAD_POSTS_ERROR ', JSON.stringify(e));
    res.status(500).json({ payload: JSON.stringify(e) })
  }
}
