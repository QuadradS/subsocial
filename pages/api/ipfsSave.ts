import type {NextApiRequest, NextApiResponse} from 'next';
import {SubsocialApi, generateCrustAuthToken} from '@subsocial/api'
import {IpfsContent} from "@subsocial/api/substrate/wrappers";
import {IPost} from "../../store/posts";

type Data = {
  payload: string[] | string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).send({payload: 'Only POST requests allowed'})
    return
  }

  const content = req.body.content;
  const mnemonic = process.env.MNEMONIC || '';
  const authHeader = generateCrustAuthToken(mnemonic);
  const spaceId = '10102' // TODO not sure what's it

  const api = await SubsocialApi.create({
    substrateNodeUrl: process.env.SUBSTRADE_NODE_URL || 'wss://rco-para.subsocial.network',
    ipfsNodeUrl: process.env.IPFS_NODE_URL || 'https://crustwebsites.net'
  })

  const substrateApi = await api.blockchain.api

  api.ipfs.setWriteHeaders({// TODO move to global object
    authorization: 'Basic ' + authHeader
  })

  const txPromises = content.map(async (p: IPost) => {
    const cid = await api.ipfs.saveContent({...p});
    await substrateApi.tx.posts.createPost(
      spaceId,
      { RegularPost: null },
      IpfsContent(cid)
    )
    return cid;
  })

  const result = await Promise.all(txPromises);

  res.status(200).json({payload: result})
}
