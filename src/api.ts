const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
}
export interface IGetMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvResults {
  page: number;
  results: IMovie[];
  totoal_pages: number;
  total_results: number;
}
export function getLatestMovies() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTvAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTvPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
export function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
