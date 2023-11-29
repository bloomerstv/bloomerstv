import LiveStreamEditor from '../components/livepeer/LiveStreamEditor'
import { APP_NAME } from '../utils/config'

export default function Home() {
  return (
    <div className="">
      <div>Project : {APP_NAME}</div>
      <LiveStreamEditor />
    </div>
  )
}
