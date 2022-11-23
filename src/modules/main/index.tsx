import React, {useEffect, useState} from 'react';
import axios from "axios";
import Posts from "../../components/posts";
import {useDispatch, useSelector} from "react-redux";
import {IRootStore} from "../../../store/reducers";
import {fetchPosts} from "../../../store/posts";
import Input from "../../components/common/input";
import Button from "../../components/common/button";

const MainModule = () => {
  const [link, setLink] = useState<null | string>(null);
  const [search, setSearch] = useState<string>('');
  const dispatch = useDispatch();
  const posts = useSelector((s: IRootStore) => s.posts.posts);
  const isAuth = useSelector((s: IRootStore) => s.auth.isAuth);

  const handleLogin = () => {
    if (!link) {
      return
    }
    window.open(link);
    window.close();
  }

  const handleGetPosts = () => dispatch(fetchPosts({search}))
  const handleLoadMorePosts = () => dispatch(fetchPosts({search, limit: posts.length + 10}))

  useEffect(() => {
    axios.get('/api/redditAuthLink')
      .then((r) => setLink(r.data.payload))
  }, []);

  return (
    <div>
      {!isAuth && (
        <Button disabled={!link} onClick={handleLogin}>
          Log in
        </Button>
      )}

      {isAuth && (
        <>
         <div className='max-w-prose'>
           <Input placeholder='React' type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
           <Button onClick={handleGetPosts}>
             get posts
           </Button>
         </div>
          {!!posts.length && (
            <>
              <Posts posts={posts}/>
              <Button onClick={handleLoadMorePosts}>
                Fetch more
              </Button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default MainModule;
