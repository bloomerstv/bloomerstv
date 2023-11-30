import React from 'react'
import { useLiveStreamersQuery } from '../../graphql/generated'

const StreamerSidebar = () => {
  const { data, called } = useLiveStreamersQuery()
  return <div className="w-1/6 min-w-[250px] h-full bg-s-bg">Sidebar</div>
}

export default StreamerSidebar
