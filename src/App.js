import React, { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";

export const API_KEY = "40a0f1e7";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  color:white
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;;
`;
const Placeholder = styled.img`
  width: 1200px;
  height: 1000px;
  margin: 10px;
  ${'' /* opacity: 50%; */}
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    padding: 6px 12px;
    margin: 0 5px;
    background-color: #333;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 5px;
  }

  button:hover {
    background-color: #555;
  }

  span {
    margin: 0 10px;
    font-weight: bold;
  }

  button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


function App() {
  const [searchQuery, updateSearchQuery] = useState("");

  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const [timeoutId, updateTimeoutId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const startIndex = (currentPage - 1) * 7; // Assuming 10 results per page
const endIndex = startIndex + 7;
  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`,
    );
    updateMovieList(response.data.Search);
    setTotalPages(Math.ceil(response.data.totalResults / 7));
  };

  const onTextChange = (e) => {
    onMovieSelect("")
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    setCurrentPage(1);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };
  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="https://icon-library.com/images/movies-icon-png/movies-icon-png-8.jpg" />
          React Movie App
        </AppName>
        <SearchBox>
          <SearchIcon src="https://cdn-icons-png.flaticon.com/512/54/54481.png" />
          <SearchInput 
           placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      {selectedMovie && <MovieInfoComponent selectedMovie={selectedMovie} onMovieSelect={onMovieSelect}/>}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.slice(startIndex, endIndex).map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
         <p>No Movie Found ....</p>
        )}
      </MovieListContainer>
      <PaginationContainer>
  <button
    onClick={() => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchData(searchQuery, currentPage - 1);
      }
    }}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span>{currentPage}</span>
  <button
    onClick={() => {
      if (currentPage < totalPages-1) {
        setCurrentPage(currentPage + 1);
        fetchData(searchQuery, currentPage -1);
      }
    }}
    disabled={currentPage === 2 }
  >
    Next
  </button>
</PaginationContainer>


    </Container>
  );
}

export default App;
