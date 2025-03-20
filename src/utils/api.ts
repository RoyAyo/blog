import axios from 'axios';
import { Post } from './types';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_URL = 'http://localhost:8080/api';

export const fetchLatestPosts = async (): Promise<Post[]> => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const response = await axios.get(`${API_URL}/posts/${slug}`);
  return response.data;
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};