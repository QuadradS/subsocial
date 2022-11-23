import type {NextApiRequest, NextApiResponse} from 'next';
import {SubsocialApi, generateCrustAuthToken} from '@subsocial/api';

type Data = {
  payload: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).send({payload: 'Only POST requests allowed'})
    return
  }

  const cid: string = req.query?.cid?.toString() || '';
  const mnemonic = process.env.MNEMONIC || '';
  const authHeader = generateCrustAuthToken(mnemonic);

  if (!cid) {
    res.status(300).send({payload: 'Error empty cid'})
    return
  }

  const api = await SubsocialApi.create({
    substrateNodeUrl: process.env.SUBSTRADE_NODE_URL || 'wss://rco-para.subsocial.network',
    ipfsNodeUrl: process.env.IPFS_NODE_URL || 'https://crustwebsites.net'
  })

  api.ipfs.setWriteHeaders({// TODO move to global object
    authorization: 'Basic ' + authHeader
  })

  const content = await api.ipfs.getContent(cid);

  res.status(200).json({payload: JSON.stringify(content)})
}
