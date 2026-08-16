import { useInView } from "react-intersection-observer";


export default function useScrollAnimation() {

    const {
        ref,
        inView
    } = useInView({

        triggerOnce: true,

        threshold: 0.15

    });


    return {
        ref,
        className:
            inView
                ?
                "animate-show"
                :
                "animate-hidden"
    }

}