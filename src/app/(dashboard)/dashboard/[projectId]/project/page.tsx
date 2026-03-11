'use client'
import { FlagsDashboard } from './flagDashboard/FlagDashboard'
import { useParams } from 'next/navigation'

function page() {
  const {projectId} = useParams();
  return (
    <div>
      <FlagsDashboard projectId={projectId}/>
      </div>
  )
}

export default page