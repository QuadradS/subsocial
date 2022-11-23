import React, {SyntheticEvent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {IRootStore} from "../../../store/reducers";
import {getPostByCid, saveContent} from "../../../store/ipfs";
import styled from './styed.module.css';
import Button from "../common/button";
import {IPost} from "../../../store/posts";
import Input from "../common/input";

const Posts = ({posts}: { posts: IPost[] }) => {
  const [postsData, setPostsData] = useState<{ [key: string]: IPost }>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [cid, setCid] = useState<string>('');
  const isSelected = (id: string) => !!selected.find((sid: string) => sid === id);
  const {saved, postByCID} = useSelector((s: IRootStore) => s.ipfs);
  const dispatch = useDispatch();

  const handleToggleSelect = (id: string) => () => {
    const isSelectedEl = isSelected(id);
    if (isSelectedEl) {
      setSelected(selected.filter((sid) => sid !== id))
    }
    if (!isSelectedEl) {
      setSelected([...selected, id])
    }
  }

  const handleSaveToIpfs = () => {
    if (!selected.length) {
      return
    }
    const content: IPost[] = selected.map((id) => postsData[id]);
    dispatch(saveContent(content));
    setSelected([])
  }
  const handleGetPostByCID = () => {
    if (!cid) {
      return
    }
    dispatch(getPostByCid(cid));
  }

  const handleLinkClick = (url: string) => (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open(url);
  }

  useEffect(() => {
    const data = posts.reduce<{ [key: string]: IPost }>((acc, p) => {
      acc[p.id] = p;
      return acc
    }, {})
    setPostsData(data);
  }, [posts.length])

  return (
    <div>
      <Button className='my-2' disabled={!selected.length} onClick={handleSaveToIpfs}>Save selected posts to IPFS</Button>

      <div className='rounded border-2 mb-2 border-solid p-2 max-w-prose'>
        <p>Saved posts: </p>
        {!saved.length && (<div>Empty</div>)}
        {saved.map((cid) => <div key={cid}>{cid}</div>)}

        <Input className='my-2' onChange={(e) => setCid(e.target.value)}/>

        <Button disabled={!cid} onClick={handleGetPostByCID}>
          Get post by cid
        </Button>

        {postByCID && (
          <div className={`rounded border-solid p-2 my-2`}>
            <button className='underline overflow-hidden max-w-full' onClick={handleLinkClick(postByCID.url)}>
              <h3 className='text-2xl	whitespace-nowrap overflow-hidden	text-ellipsis'>{postByCID.title}</h3>
            </button>

            <p className={styled.description}>{postByCID.selftext}</p>
            <b>Posted by: {postByCID.author}</b>
          </div>
        )}
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {Object.values(postsData).map((p: IPost) => (
          <div className={`cursor-pointer rounded border-${!isSelected(p.id) ? 4 : 2} border-solid	p-2`} key={p.id}
               onClick={handleToggleSelect(p.id)}>
            <button className='underline overflow-hidden max-w-full	' onClick={handleLinkClick(p.url)}>
              <h3 className='text-2xl	whitespace-nowrap overflow-hidden	text-ellipsis	'>{p.title}</h3>
            </button>

            <p className={styled.description}>{p.selftext}</p>
            <b>Posted by: {p.author}</b>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts;
