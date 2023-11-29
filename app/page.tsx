import LiveStreamEditor from '../components/livepeer/LiveStreamEditor'
import { APP_NAME } from '../utils/config'

export default function Home() {
  return (
    <div className="text-p-text bg-p-bg">
      <div>Project : {APP_NAME}</div>
      <LiveStreamEditor />
    </div>
  )
}
