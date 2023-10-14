import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [pictureData, setPictureData] = useState({});
  const [banList, setBanList] = useState([]);
  const [started, setStarted] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Generate a random date
  const getRandomDate = (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  // Fetch a random picture
  const fetchRandomPicture = async () => {
    const randomDate = getRandomDate(new Date(1995, 6, 16), new Date());
    const formattedDate = `${randomDate.getFullYear()}-${
      randomDate.getMonth() + 1
    }-${randomDate.getDate()}`;

    try {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/apod?date=${formattedDate}&api_key=npJC3WN9qYq4x96WiqNQla1oBfBq6jsLW977SOG2`
      );
      const { title, explanation, url } = response.data;

      // Check if the title is in the ban list
      if (!banList.includes(title)) {
        setPictureData({
          title,
          description: explanation,
          imageURL: url,
        });
      } else {
        fetchRandomPicture(); // Fetch another random picture
      }
    } catch (error) {
      console.error("Error fetching the picture:", error);
    }
  };

  const addToBanList = (title) => {
    setBanList((prevList) => [...prevList, title]);
    fetchRandomPicture();
  };
  return (
    <div className="App">
      {!started ? (
        <div className="welcome-container">
          <h1>Welcome to Picture App!</h1>
          <p>Click below to start exploring random images.</p>
          <button
            onClick={() => {
              fetchRandomPicture();
              setStarted(true);
            }}
          >
            Start
          </button>
        </div>
      ) : (
        <>
          <h1>{pictureData.title}</h1>
          <div className="image-wrapper">
            <img src={pictureData.imageURL} alt={pictureData.title} />
          </div>
          <p>{pictureData.description}</p>
          <div className="button-container">
            <button onClick={() => addToBanList(pictureData.title)}>
              Ban this title
            </button>
            <button onClick={fetchRandomPicture}>Fetch Random Picture</button>
          </div>
          <div className="ban-list-container">
            <button onClick={toggleDropdown}>Ban List</button>
            {isDropdownOpen && (
              <ul className="ban-list">
                {banList.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
