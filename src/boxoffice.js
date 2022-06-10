import {useEffect, useState} from "react";
import Glide from "@glidejs/glide"

import './boxoffice.scss';

function Boxoffice()
{
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const key ='3e56c5d518bc82f65d4d1d16806fdd37';
    const today = new Date();
    const targetDT = today.getFullYear()+(today.getMonth()).toString().padStart(2,0)+(today.getDate().toString().padStart(2,0));
    const getMovies = async () => {
        const json = await (
            await fetch(
                `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}&targetDt=${targetDT}`
            )
        ).json();
        setMovies(json.boxOfficeResult.dailyBoxOfficeList);;
        setLoading(false);
    };
    var carousels = document.querySelectorAll('.glide');
    useEffect(() => {
        getMovies();
    }, []);
    useEffect(() => {
        console.log(carousels.length);
        for(var i = 0 ; i < carousels.length; i++){
            var glide = new Glide(carousels[i], {
                type: 'carousel',
                startAt: 0,
                perView: 5,
            });  
            glide.mount();
        }
    }, [carousels]);
    return (
        <div>
            <h1> today boxoffice</h1>
            <div className="glide">
                {loading ? ( 
                    <p>loading...</p>) : (
                        <div>
                            <div className="frames glide__track" data-glide-el="track">
                                <ul className = "frames__list glide__slides">
                                    {movies.map((movie) => (
                                        <li className="frames__item glide__slide" key={movie.rank}>
                                            <div className="boxoffice">
                                                <h2> {movie.rank} </h2>
                                                <p> {movie.movieNm} ({movie.openDt.substr(0, 4)}) </p>
                                                <p> 오늘 관객수: {movie.audiCnt} </p>
                                                <p> 누적 관객수: {movie.audiAcc} </p>
                                            </div>
                                        </li>    
                                    ))}
                                </ul>
                            </div>
                            <div data-glide-el="controls">
                                <button data-glide-dir="<">&lt;</button>
                                <button data-glide-dir=">">&gt;</button>
                            </div>
                        </div>
                    )
                }
            </div>
            <h1> week boxofiice </h1>
        </div>
    )
}
export default Boxoffice;