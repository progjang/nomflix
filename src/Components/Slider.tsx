import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import { IMovie } from "../api";
import { useState } from "react";
import PopupScreen from "./PopupBox";

const OFFSET = 6;
const NETFLIX_LOGO_URL =
  "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

const SliderContainer = styled.div`
  position: relative;
  height: 180px;
  top: -170px;
  margin-bottom: 70px;
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
  background-color: rgba(0, 0, 0, 0.5);
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.innerWidth - -5 },
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
interface ISliderProps {
  sliderTitle: string;
  dataSet: IMovie[];
}
function Slider({ sliderTitle, dataSet }: ISliderProps) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const isModal = useRouteMatch<{ id: string }>("/movies/:id");
  const [currentRow, setCurrentRow] = useState("");

  const increaseIndex = () => {
    if (dataSet) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = dataSet?.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (id: string) => {
    setCurrentRow(sliderTitle);
    history.push(`/movies/${id}`);
  };
  const onOverlayClicked = () => {
    setCurrentRow("");
    history.push("/");
  };

  console.log(sliderTitle, currentRow);

  return (
    <>
      <SliderContainer>
        <SliderTitle>{sliderTitle}</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            transition={{ type: "tween" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={index}
          >
            {dataSet
              ?.slice(1)
              .slice(OFFSET * index, OFFSET * index + OFFSET)
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
                    <h4>{result.title}</h4>
                  </Info>
                </Box>
              ))}
            <div
              onClick={increaseIndex}
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
      </SliderContainer>
      <AnimatePresence>
        {isModal && sliderTitle == currentRow ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></Overlay>
            <PopupScreen dataSet={dataSet} id={isModal.params.id} />
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Slider;
