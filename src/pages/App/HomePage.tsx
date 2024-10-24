
import  { useEffect } from 'react';


const HomePage = () => {
  useEffect(() => {
    console.log('hello');
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
