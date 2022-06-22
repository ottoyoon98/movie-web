import Glide from "@glidejs/glide"
import { useEffect } from "react";
import './boxoffice.scss';

function Carousel(){
    let carousels = document.querySelectorAll(`.glide`);
    useEffect(() => {
        for (var i = 0 ; i < carousels.length ; i++){
            const glide = new Glide(carousels[i], {
                type: 'carousel',
                startAt: 0,
                perView: 6,
                breakpoints: {
                    1500: {
                    perView: 5
                    },
                    1200: {
                    perView: 3
                    },
                    730: {
                    perView: 2
                    }
                }
                
            });
            glide.mount();
            console.log(carousels[i].id);
        }
    }, [carousels]);
    return ;
};
export default Carousel;