import axios from 'axios';

export async function searchPhrase(text, pageIndex) {
  const searchParams = new URLSearchParams({
    key: '43699843-1d9db61f767a5d2341404b3d9',
    q: text,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: false,
    page: pageIndex,
    per_page: 40,
  });
  return await axios.get(`https://pixabay.com/api/?${searchParams}`);
}
