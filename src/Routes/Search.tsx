import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  background: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  jusify-content: center;
  padding-bottom: 100px;
`;
const Keyword = styled.div`
  padding: 100px;
  display: flex;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return (
    <Wrapper>
      <Keyword>
        <h3>Search keyword:</h3>{" "}
        <h2 style={{ marginLeft: "10px", color: "tomato" }}>{keyword}</h2>
      </Keyword>
    </Wrapper>
  );
}

export default Search;
