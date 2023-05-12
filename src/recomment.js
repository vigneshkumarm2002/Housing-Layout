import Confetti from 'react-confetti';
import "./App.css"
function recommend() {
    return (
        <div className='result'>
        <Confetti
          width="100%"
          height="100%"
        />
        </div>
      );
}

export default recommend;