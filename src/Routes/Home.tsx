import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getLatestMovies,
  getMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";

const OFFSET = 6;
const NEXFLIX_LOGO_URL =
  "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 100px;
`;
const Loader = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const OverView = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Home() {
  const { isLoading: isLoadingLatest, data: dataLatest } = useQuery<IMovie>(
    ["movies", "latest"],
    getLatestMovies
  );

  const { isLoading: isLoadingNowPlaying, data: dataNowPlaying } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

  const { isLoading: isLoadingTopRated, data: dataTopRated } =
    useQuery<IGetMoviesResult>(["movies", "topLated"], getTopRatedMovies);

  const { isLoading: isLoadingUpcoming, data: dataUpcoming } =
    useQuery<IGetMoviesResult>(["movies", "upComing"], getUpcomingMovies);

  let isLoading =
    isLoadingNowPlaying ||
    isLoadingTopRated ||
    isLoadingUpcoming ||
    isLoadingLatest;
  console.log(dataLatest);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(dataLatest?.backdrop_path || "")}>
            <Title>Latest: {dataLatest?.title}</Title>
            <OverView>{dataLatest?.overview}</OverView>
          </Banner>

          {dataNowPlaying && (
            <Slider
              category="movie"
              sliderTitle="Now Playing"
              dataSet={dataNowPlaying.results}
            />
          )}
          {dataTopRated && (
            <Slider
              category="movie"
              sliderTitle="Top Rated"
              dataSet={dataTopRated.results}
            />
          )}
          {dataUpcoming && (
            <Slider
              category="movie"
              sliderTitle="Upcoming"
              dataSet={dataUpcoming.results}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
