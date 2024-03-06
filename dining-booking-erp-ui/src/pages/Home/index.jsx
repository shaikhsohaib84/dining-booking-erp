import { useEffect } from "react";

const Home = () => {
    useEffect(() => {
        console.log('Indide')
    }, [])

    return (
        <>Home Page</>
    )
}

export default Home;