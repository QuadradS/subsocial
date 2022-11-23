import { combineReducers } from "redux";
import authReducer, {IAuth} from "./auth";
import postsStore, {IPosts} from "./posts";
import ipfsStore, {IIpfsState} from "./ipfs";

const rootStore = {
  auth: authReducer,
  posts: postsStore,
  ipfs: ipfsStore,
}

export type IRootStore = {
  auth: IAuth;
  posts: IPosts;
  ipfs: IIpfsState;
};

export default combineReducers(rootStore);
