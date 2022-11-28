import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router'
import {authUser} from "../store/auth";
import {useDispatch, useStore} from "react-redux";
import Link from "next/link";

enum EState {
  INIT = "INITIAL_STATE",
  SUCCESS = "SUCCESS_STATE",
  FAIL = "FAIL_STATE",
  LOADING = 'LOADING_STATE'
}

const Callback = () => {
  const {query, push} = useRouter();
  const [state, setState] = useState<EState>(EState.INIT);
  const dispatch = useDispatch()

  const init = async () => {
    if (!query?.code || state === EState.LOADING) {
      return
    }

    setState(EState.LOADING);

    try {
      dispatch(authUser(query.code as string))
      setState(EState.SUCCESS);

      push('/')
    } catch (e) {
      setState(EState.FAIL);
      console.error(e)
    }
  }

  useEffect(() => {
    init();
  }, [query?.state, query?.code])

  return (
    <div>
      {state === EState.LOADING || state === EState.INIT && ('WAIT')}
      {state === EState.SUCCESS && (<div>
        <Link href="/">SUCCESS LOGIN! Back to main page</Link>
      </div>)}
      {state === EState.FAIL && (<div>
        ERROR :(
      </div>)}
    </div>
  )
}

export default Callback;
