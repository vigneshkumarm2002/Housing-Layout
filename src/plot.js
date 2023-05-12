

function Plot(props) {
   const handleAssignClick=()=>{
    props.onAssignValue()
   }
   const handleCloseClick=()=>{
    props.onClose();
   }
   const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      props.onAssignValue();
    }
  };
   
    return (
        <div>
        
            <div className="plotContainer" >
            <h3>Enter Plot Name :</h3>
            <div  className="plotForm">
                <input autoFocus type="text" value={props.inputValue} onChange={props.onInputChange} onKeyDown={handleEnterKey} ></input>
                <button onClick={handleAssignClick} >Assign</button>
            <span onClick={handleCloseClick}  className="material-symbols-outlined closeIcon">
                close
            </span>
            </div>
          </div >
        </div>
       
    );
}

export default Plot;