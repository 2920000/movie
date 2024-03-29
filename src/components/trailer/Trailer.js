import React, { useEffect, useRef, useState } from "react";
import tmdbApi from "../../api/apiThemovie";
import "./trailer.scss";
function Trailer(props) {
  const { category, id } = props;
  const [trailer, setTrailer] = useState([]);
  const iframeRef = useRef();
console.log(trailer)
  useEffect(() => {
    const params = {};
    const fetchData = async () => {
      const response = await tmdbApi.getVideos(category, id, { params });
      console.log(response)
      setTrailer(response.results.splice(0, 2)); 
    };
    fetchData();
  }, []);
  return (
    <div className="trailer-list">
      {trailer.map((e) => (
        <div className="trailer-item" key={e.id}>
          <iframe
            className="trailer-iframe"
            src={`https://www.youtube.com/embed/${e.key}`}
            title='trailer'
          />
        </div>
      ))}
    </div>
  );
}

export default Trailer;
