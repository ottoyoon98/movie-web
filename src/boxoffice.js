import {useEffect, useState} from "react";
import './boxoffice.css';
function Boxoffice()
{
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const key ='3e56c5d518bc82f65d4d1d16806fdd37';
    const today = new Date();
    const targetDT = today.getFullYear()+(today.getMonth()).toString().padStart(2,0)+(today.getDate().toString().padStart(2,0));
    const getMovies = async() => {
        const response = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}&targetDt=${targetDT}`);
        const json = await response.json();
        //console.dir(json);
        setMovies(json.boxOfficeResult.dailyBoxOfficeList);;
        setLoading(false);
    };
    useEffect(() => getMovies(), []);
    return (
        <div>
            <h1> today boxoffice</h1>
            <div className="boxoffices">
                {loading ? ( 
                    <p>loading...</p>) : (
                    movies.map((movie) => (
                        <div className="boxoffice">
                            <h2> {movie.rank} </h2>
                            <p> {movie.movieNm} ({movie.openDt.substr(0, 4)}) </p>
                            <p> 오늘 관객수: {movie.audiCnt} </p>
                            <p> 누적 관객수: {movie.audiAcc} </p>
                        </div>
                    )))
                }
            </div>
            <h1> week boxofiice </h1>
        </div>
    )
}
export default Boxoffice;