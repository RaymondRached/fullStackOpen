const Notification = ({ message,type }) => {
  if (message === null && type == null) {
    return null
  }

  let color
  switch (type) {
    case 'success': color = 'green'; break
    case 'failure': color = 'red'; break
    default : color = 'black'
  }

  return (
    <div className="notification" style={{color}}>
      {message}
    </div>
  )
}

export default Notification