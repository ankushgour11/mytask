import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const options = {
  method: "GET",
  url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
  headers: {
    "x-rapidapi-key": "1c781f287dmsh6997f5277a2b28cp190b82jsnd9cbc77bf1e4",
    "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
  },
};

export default function ListItems() {
  const [cityData, setCityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    // Set loading state to true before fetching
    try {
      const response = await axios.request(options);
      setCityData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error); // Set error state if an error occurs
    } finally {
      setIsLoading(false); // Set loading state to false after fetching (regardless of success or failure)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const filteredResults = cityData.filter((city) => {
        return (
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredData(filteredResults);
    }
  };
  return (
    <>
      <div className="wrapper-outer">
        <div className="searchbox-wrapper">
          <input
            type="text"
            id="searchBox"
            className="searchBox"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch} // Add onKeyDown handler
          />
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>Country</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="3">Loading...</td>
                </tr>
              )}
              {(filteredData || cityData)?.map((city, index) => (
                <tr key={city.id || index}>
                  <td>{index + 1}</td>
                  <td>{city.name}</td>
                  <td>
                    {city.country} -{" "}
                    <img
                      src={`https://flagsapi.com/${city.countryCode}/flat/16.png`}
                      alt={`Flag of ${city.country}`}
                      onError={(event) => {
                        event.target.style.display = "none";
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-wrapper pagination-container">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex="-1">
                  Previous
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
          <div className="limit-input">
            <label htmlFor="limit">Items per page:</label>
            <input type="number" id="limit" min="5" max="10" />
          </div>
        </div>
      </div>
    </>
  );
}
