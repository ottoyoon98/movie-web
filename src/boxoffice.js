import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide"
import './boxoffice.scss';

function Boxoffice({idx, apiType = "Daily"})
{
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [range,  setRange] = useState("");
    const key1 = '3e56c5d518bc82f65d4d1d16806fdd37';
    const key2 = 'G3O5TIC12LVI911FTE84';
    const yesterday = new Date((new Date())-86400000);
    const lastweek = new Date((new Date())-86400000*7)
    let targetDT1 = yesterday.getFullYear()+(yesterday.getMonth()+1).toString().padStart(2,0)+(yesterday.getDate()).toString().padStart(2,0);
    let targetDT2 = lastweek.getFullYear()+(lastweek.getMonth()+1).toString().padStart(2,0)+(lastweek.getDate()).toString().padStart(2,0);
    useEffect(() => {
        const getMovies = async (movie) => {
            const json = await (
                await fetch(
                    `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${movie.movieNm}&releaseDts=${movie.openDt.replaceAll("-","")}&ServiceKey=${key2}`
                )
            ).json();
            return {
                "title": movie.movieNm,
                "rnum": movie.rnum,
                "rank": movie.rank,
                "openDt": movie.openDt,
                "audiCnt": movie.audiCnt,
                "audiAcc": movie.audiCnt,
                "posters":json.Data[0].Result[0].posters,
                "kmdbURL":json.Data[0].Result[0].kmdbUrl};
        }
        const getBoxOffice = async() => {
            const response = await(await (
                await fetch(
                    apiType === "Daily" ? `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key1}&targetDt=${targetDT1}` : `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json?key=${key1}&weekGb=0&targetDt=${targetDT2}` 
                    
                )
            ).json()).boxOfficeResult;
            setRange(response.showRange);
            const boxOffice = apiType === "Daily" ? await(response.dailyBoxOfficeList.map((movie) => getMovies(movie))) : await(response.weeklyBoxOfficeList.map((movie) => getMovies(movie)));
            await Promise.all(boxOffice).then((result) => {
                console.log(result);
                setMovies(result);
                setLoading(false);
            }).catch();
        }
        getBoxOffice();
    }, [targetDT1, targetDT2, apiType]);
    console.log(`#g${idx}`)
    let carousels = document.querySelectorAll(`#g${idx}`);
    useEffect(() => {
        console.log(carousels);
        for (var i = 0 ; i < carousels.length ; i++){
            const glide = new Glide(carousels[i], {
                type: 'carousel',
                gap: 20,
                startAt: 0,
                perView: 7,
                breakpoints: {
                    1500: {
                    perView: 6
                    },
                    1200: {
                    perView: 4
                    },
                    730: {
                    perView: 3
                    }
                }
                
            });
            try {
                glide.mount();
            } catch{
                console.log("hi");
            }
            console.log(carousels[i].id);
        }
    }, [carousels]);
    return (
        <div className="main">
            <h1 className="head">
                 {apiType} BOX OFFICE
                 <p>({range})</p>
            </h1>
            
            <div className="glide" id={"g"+idx}>
                {loading ? ( 
                    <p>loading...</p>) : (
                        <div >
                            <div className="frames glide__track" data-glide-el="track">
                                <ul className = "frames__list glide__slides">
                                    {movies.map((movie) => (
                                        <li className="frames__item glide__slide" key={movie.rnum}>
                                            {console.log(movie)}
                                            <div className="boxoffice" >
                                                <a href={movie.kmdbURL}>
                                                    {movie.posters === "" ? (<img className="moviePoster" src="https://www.booooooom.com/wp-content/uploads/2015/04/emptyfilmposters-01.jpg" alt="poster" />) : ( <img className="moviePoster" src={movie.posters.split("|")[0]} alt="poster"/>)}
                                                </a>
                                                <h3> {movie.rank}. {movie.title}</h3>
                                                 <p>  ({movie.openDt/*.substr(0, 4)*/}) </p>
                                                
                                            </div>
                                        </li>    
                                    ))}
                                </ul>
                            </div>
                            <div data-glide-el="controls">
                                <button className="glide_btn" data-glide-dir="<">&lt;</button>
                                <button className="glide_btn" data-glide-dir=">">&gt;</button>
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
};
Boxoffice.propTypes = {
    idx: PropTypes.string.isRequired,
    apiType: PropTypes.string.isRequired,
};

export default Boxoffice;