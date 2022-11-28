import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
  payload: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const clientID = process.env.CLIENT_ID;
  const callbackHost = process.env.HOST_DOMAIN;
  const resType = 'code';
  const state = 'SOME_STATE';
  const redirectUrl = `${callbackHost}/callback`;
  const scope = 'identity, edit, flair, history, modconfig, modflair, modlog, modposts, modwiki, mysubreddits, privatemessages, read, report, save, submit, subscribe, vote, wikiedit, wikiread'

  const linkToAuth = `https://www.reddit.com/api/v1/authorize?api_key&client_id=${clientID}&redirect_uri=${redirectUrl}&response_type=${resType}&scope=${scope}&state=${state}
`
  try {
    res.status(200).json({payload: linkToAuth})
  } catch (e: any) {
    res.status(500).json({payload: e?.message || JSON.stringify(e)})
  }
}
