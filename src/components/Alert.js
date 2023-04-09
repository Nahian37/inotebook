// import React from 'react'

// const Alert = (props) => {
//   return (
//     <div className="alert alert-primary" role="alert">
//         {props.alert.msg}
//     </div>
//   )
// }

// export default Alert


import React from 'react'

function Alert(props) {
  const capitalize = (word)=>{
    let lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase()+lower.slice(1);
  }
  return (
    <div style={{height: '50px'}}>
      {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
    </div>    
  )
}

export default Alert
