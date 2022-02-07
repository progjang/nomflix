import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getTvAiringToday,
  getTvPopular,
  getTvTopRated,
  IGetTvResults,
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

function Tv() {
  const { isLoading: isLoadingAiringToday, data: dataAiringToday } =
    useQuery<IGetTvResults>(["tv", "airingToday"], getTvAiringToday);

  const { isLoading: isLoadingPopular, data: dataPopular } =
    useQuery<IGetTvResults>(["tv", "getTvPopular"], getTvPopular);

  const { isLoading: isLoadingTopRated, data: dataTopRated } =
    useQuery<IGetTvResults>(["tv", "getTvTopRated"], getTvTopRated);

  let isLoading = isLoadingAiringToday || isLoadingPopular || isLoadingTopRated;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              dataAiringToday?.results[0].backdrop_path || ""
            )}
          >
            <Title>{dataAiringToday?.results[0].name}</Title>
            <OverView>{dataAiringToday?.results[0].overview}</OverView>
          </Banner>
          {dataTopRated && (
            <Slider
              category="tv"
              sliderTitle="Top Rated"
              dataSet={dataTopRated.results}
            />
          )}
          {dataAiringToday && (
            <Slider
              category="tv"
              sliderTitle="Airing Today"
              dataSet={dataAiringToday.results}
            />
          )}
          {dataPopular && (
            <Slider
              category="tv"
              sliderTitle="Popular"
              dataSet={dataPopular.results}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
