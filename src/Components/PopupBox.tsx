import { motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

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
  z-index: 1;
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
interface IPopupScreenProps {
  dataSet: IMovie[];
  id: string;
}
function PopupScreen({ dataSet, id }: IPopupScreenProps) {
  const { scrollY } = useViewportScroll();
  const clickedItem = dataSet?.find((result) => result.id === +id);
  return (
    <ModalBox layoutId={id} style={{ top: scrollY.get() + 50 }}>
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
          <ModalTitle>{clickedItem.title}</ModalTitle>
          <ModalOverview>{clickedItem.overview}</ModalOverview>
        </>
      )}
    </ModalBox>
  );
}
export default PopupScreen;
