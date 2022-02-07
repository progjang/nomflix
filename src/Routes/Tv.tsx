import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { getTvAiringToday, IGetTvResults } from "../api";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";

const OFFSET = 6;
const NETFLIX_LOGO_URL =
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
const Slider = styled.div`
  position: relative;
  top: -180px;
`;
const SliderTitle = styled.h3`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  position: absolute;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 13px;
  }
  bottom: 0;
  width: 100%;
`;
const Overlay = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;
const ModalBox = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: absolute;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;
const ModalImage = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const ModalTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 30px;
  position: relative;
  top: -80px;
`;
const ModalOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
  padding: 20px;
`;
const rowVariants = {
  hidden: { x: window.outerWidth },
  visible: { x: 0 },
  exit: { x: -window.innerWidth },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      transition: { type: "tween" },
      delay: 0.5,
      duration: 0.3,
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 0.7,
    transition: {
      transition: { type: "tween" },
      delay: 0.5,
      duration: 0.3,
    },
  },
};
function Tv() {
  const [row, setRow] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const isModal = useRouteMatch<{ id: string }>("/tvs/:id");

  const { isLoading, data } = useQuery<IGetTvResults>(
    ["tv", "airingToday"],
    getTvAiringToday
  );
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseRow = () => {
    if (data) {
      toggleLeaving();
      const totalTvs = data?.results.length - 1;
      const maxRows = Math.floor(totalTvs / OFFSET) - 1;
      setRow((prev) => (prev === maxRows ? 0 : prev + 1));
    }
  };
  console.log(isModal);
  const onBoxClicked = (id: string) => {
    history.push(`/tvs/${id}`);
  };
  const onOverlayClicked = () => {
    history.push("/tv");
  };
  const clickedItem =
    isModal?.params.id &&
    data?.results.find((result) => result.id === +isModal?.params.id);
  console.log(clickedItem);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseRow}
            bgphoto={
              data?.results[0].backdrop_path
                ? makeImagePath(data?.results[0].backdrop_path)
                : NETFLIX_LOGO_URL
            }
          >
            <Title>{data?.results[0].name}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <SliderTitle>Airing Today</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                transition={{ type: "tween" }}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={row}
              >
                {data?.results
                  .slice(1)
                  .slice(OFFSET * row, OFFSET * row + OFFSET)
                  .map((result) => (
                    <Box
                      layoutId={result.id + ""}
                      onClick={() => onBoxClicked(result.id + "")}
                      variants={boxVariants}
                      initial="nomal"
                      whileHover="hover"
                      key={result.id}
                      bgphoto={
                        result?.backdrop_path
                          ? makeImagePath(result.backdrop_path, "w500")
                          : NETFLIX_LOGO_URL
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{result.name}</h4>
                      </Info>
                    </Box>
                  ))}
                <div
                  onClick={increaseRow}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  Next
                </div>
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {isModal ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <ModalBox
                  layoutId={isModal.params.id}
                  style={{ top: scrollY.get() + 50 }}
                >
                  {clickedItem && (
                    <>
                      <ModalImage
                        style={{
                          backgroundImage: `linear-gradient(to top, black,transparent), url(${makeImagePath(
                            clickedItem.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <ModalTitle>{clickedItem.name}</ModalTitle>
                      <ModalOverview>{clickedItem.overview}</ModalOverview>
                    </>
                  )}
                </ModalBox>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
