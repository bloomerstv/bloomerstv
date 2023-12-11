import React from 'react'

const WorkingOnIt = ({ subtitle }: { subtitle?: string }) => {
  return (
    <div className="centered-col h-full w-full bg-p-bg">
      <img
        className="w-full sm:w-[500px] "
        src="https://i.pinimg.com/550x/ac/d6/2b/acd62b8bd713934d8a360b12375dba6d.jpg"
        alt="logo"
      />
      {subtitle && <div className="text-center mt-4 text-sm">{subtitle}</div>}
    </div>
  )
}

export default WorkingOnIt
