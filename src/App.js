
import { useState } from 'react';
import Plot from "./plot.js"
import { nanoid } from 'nanoid'
import './App.css';


function App() {
  const [rowSize, setrowSize] = useState(5)
  const [columnSize, setcolumnSize] = useState(5)
  const [rowvalue, setrowvalue] = useState(rowSize)
  const [columnvalue, setcolumnvalue] = useState(columnSize)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [houseDistances, setHouseDistances] = useState([]);
  const [shortestDistanceIndex, setShortestDistanceIndex] = useState("");
  const [recommendBtn,setrecommendBtn]=useState(false)



  //Tracking dimention input
  const tractInputrow = (e) => {
    setrowvalue(parseInt(e.target.value))
  }
  const tractInputcolumn = (e) => {
    setcolumnvalue(parseInt(e.target.value))
  }
  const handleDimensionSumbit = (e) => {
    e.preventDefault()
    setrowSize(rowvalue)
    setcolumnSize(columnvalue)
  }


  const handleCellClick = (e,rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
    setModalOpen(true);
    setInputValue(e.target.innerHTML)
    setrecommendBtn(false)
  };

  //child comp form value
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  //child comp
  const handleModalClose = () => {
    setModalOpen(false);
  };


//child comp assign button click
  const handleAssignValue = () => {
    const { rowIndex, colIndex } = selectedCell;
    const table = document.getElementById('layout');
    const cell = table.rows[rowIndex].cells[colIndex];
    const updatedValue = inputValue.toLowerCase(); 
    const values = updatedValue.trim()
    const styles = {
      color: 'black',
      backgroundColor:values.includes("house")?'#83ecdc':'#d6f9f3'
    };
    

    //extracting string into array
    const myArray = values.split(/[\s,]+/);
    if (values.includes("house")) {
      //finding value that contains number beside eg.house2
      const index = myArray.findIndex(item => /^house\d+$/i.test(item));
      const myindex = myArray.indexOf("house")
      //this is for some may enter input as house 2 then the array will be [house,2]
      if (Number.isInteger(parseInt(myArray[myindex + 1]))) {
        cell.innerHTML = (myArray[myindex] + " " + (myArray[myindex + 1]))
        console.log(cell.innerHTML)
        Object.assign(cell.style, styles)
      }

      //this is only contains house
      else if (myArray.includes("house")) {
        cell.innerHTML = (myArray[myindex])
        Object.assign(cell.style, styles)
      }

      //this is for name liks house2,house3
      else {
        cell.innerHTML = (myArray[index])
        Object.assign(cell.style, styles)
        
      }
    }
    //this is for other names
    else{
      if(values !== ""){
        cell.innerHTML = (myArray)
        Object.assign(cell.style, styles)
    }
    else{
      cell.innerHTML = " "
      cell.style=" "
    }
  }

    setModalOpen(false);
  };


//calculating distance between services and house

  const calculateDistance = (service, house) => {
    const table = document.getElementById('layout');
    const rows = table.getElementsByTagName('tr');
    let serviceRow, serviceColumn, houseRow, houseColumn;
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
        const cell = table.rows[i].cells[j];

        if (cell.innerHTML.includes(service)) {
          serviceRow = i;
          serviceColumn = j
        }
        else if (cell.innerHTML.includes(house)) {
          houseRow = i;
          houseColumn = j
        }
      }
    }
    //distance formula 
    const distance = Math.abs(serviceRow - houseRow) + Math.abs(serviceColumn - houseColumn)
    return distance
  }

//calling calculate distance function by passing arguments and finding distance

  const calculateHouseDistances = (house) => {
    let shortestDistance = Infinity;
    let shortestIndex = null;
    const distances = house.map((house, index) => {
      const gymDistance = calculateDistance('gym', house);
      const restaurantDistance = calculateDistance('res', house);
      const hospitalDistance = calculateDistance('hos', house);
      const totalDistance = gymDistance + restaurantDistance + hospitalDistance;
      if (totalDistance < shortestDistance) {
        shortestDistance = totalDistance;
        shortestIndex = house;
      }
      return {
        value: totalDistance,
        index: index,
      };
    });
    setHouseDistances(distances);
    setShortestDistanceIndex(shortestIndex);
  };


//Getting the cells which contains different houses and passing it into calculatehousedistance function
  const handleRecommendBtn = () => {
    const table = document.getElementById('layout');
    const rows = table.getElementsByTagName('tr');
    const houseValues = [];
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
        const cell = table.rows[i].cells[j];
        if (cell.innerHTML.includes("house")) {
          houseValues.push(cell.innerHTML);
        }
      }
    }
    calculateHouseDistances(houseValues);
    setrecommendBtn(true)
  }

return (
  <div className="App">
    <div className="titlebox">
    <h1>Housing layout</h1>
    </div>
    
    <form onSubmit={handleDimensionSumbit} className="dimensionContainer">
      <p>Enter Table Dimension :</p>
      <div className='dimensionInput'>
      <input type="number" onChange={tractInputrow}></input>
      <p>X</p>
      <input type="number" onChange={tractInputcolumn}></input>
      <button> Apply</button>
      </div>
    </form>
    <div className='note'>
      <p>Note :</p>
      <ul>
        <li>
        A plot can only accommodate a maximum of one House.
        </li>
        <li>
        A plot can have a single or combination of services (Restaurant,Gym,Hospital).
 
        </li>
      </ul>
    </div>
    <div className='tableContainer'>
      <table className="table" id="layout">
        <tbody>
          {Array(rowSize).fill().map((_, rowindex) => {
            return <tr key={rowindex}  >
              {
                Array(columnSize).fill().map((_, colindex) => {
                  return <td key={colindex} onClick={(e) => handleCellClick(e,rowindex, colindex)}></td>
                })
              }
            </tr>
          })}
        </tbody>
      </table>

      {modalOpen && <Plot onAssignValue={handleAssignValue} inputValue={inputValue} onInputChange={handleInputChange} onClose={handleModalClose} />}
    </div>
    <div>
    <button className='distanceBtn' onClick={handleRecommendBtn}>Recommend house</button>
    <div className='result'>
    {recommendBtn && <p ><span>"{shortestDistanceIndex}"</span> is the best house, all services available nearby it.</p>}
    </div>
    </div>
  </div>
);
}

export default App;
