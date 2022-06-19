import {useEffect, useState} from "react";
import Glide from "@glidejs/glide"
import './boxoffice.scss';

function Boxoffice()
{
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const key1 = '3e56c5d518bc82f65d4d1d16806fdd37';
    const key2 = 'G3O5TIC12LVI911FTE84';
    const today = new Date();
    let targetDT = today.getFullYear()+(today.getMonth()).toString().padStart(2,0)+(today.getDate().toString().padStart(2,0));
     
    let carousels = document.querySelectorAll('.glide');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        const getMovies = async (movie) => {
            const json = await (
                await fetch(
                    `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${movie.movieNm}&releaseDts=${movie.openDt.replaceAll("-","")}&ServiceKey=${key2}`
                )
            ).json();
            return {
                "title": movie.movieNm,
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
                    `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key1}&targetDt=${targetDT}`
                )
            ).json()).boxOfficeResult.dailyBoxOfficeList;
            const boxOffice = await(response.map((movie) => getMovies(movie)));
            //Promise.allSettled(boxOffice);
            await Promise.all(boxOffice).then((result) => {
                console.log(result);
                setMovies(result);
                setLoading(false);
            });
        }
        getBoxOffice();
    }, [targetDT]);
    useEffect(() => {
        console.log(carousels.length);
        for(var i = 0 ; i < carousels.length; i++){
            var glide = new Glide(carousels[i], {
                type: 'carousel',
                startAt: 0,
                perView: 6,
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
                                                {console.log(movie)}
                                                <a href={movie.kmdbURL}>
                                                    {movie.posters === "" ? (<img src="https://www.booooooom.com/wp-content/uploads/2015/04/emptyfilmposters-01.jpg" alt="poster" width="240px"/>) : ( <img src={movie.posters.split("|")[0]} alt="poster" width="240px"/>)}
                                                </a>
                                                <h3> {movie.rank}. {movie.title}</h3>
                                                 <p>  ({movie.openDt/*.substr(0, 4)*/}) </p>
                                                
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
            <img src="http://file.koreafilm.or.kr/thm/02/00/01/46/tn_DPK004440.JPG" alt="7광구"></img>
        </div>
    )
}
export default Boxoffice;