'use client'
import React from 'react'
import { CheckIcon } from 'lucide-react'
import GoSuperButton from '../../../components/pages/dashboard/go-live/GoSuperButton'
import useSession from '../../../utils/hooks/useSession'

const page = () => {
  const { isAuthenticated } = useSession()
  const freePlansPoints = [
    'Unlimited Streams',
    'Creating Clips',
    'Stream VODs for 7 days',
    'No Viewer Limit',
    '5% split on all collects'
  ]

  const superPlansPoints = [
    'Everything in Free Plan',
    'Stream VODs for 28 days',
    'Transcoding for VODs',
    'Super Bloomers Badge',
    '100% revenue on collects'
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="centered-col p-8">
      <div className="text-5xl font-bold m-12">Plans</div>
      <div className="flex flex-row justify-center gap-x-12 text-sm font-semibold">
        {/* // free plan */}
        <div className="flex shadow-sm flex-col gap-y-4 w-[300px] bg-s-bg rounded-2xl p-8">
          <div className="font-bold text-lg">Free</div>
          <div>
            <div className="text-2xl">$0</div>
            <div className="text-sm font-normal text-s-text">per month</div>
          </div>

          {/* description */}
          <div>
            For anyone who wants to try out the platform and just stream
            casually.
          </div>

          {/* points */}
          <div className="space-y-1">
            {freePlansPoints.map((point) => (
              <div key={point} className="flex flex-row gap-x-2">
                <CheckIcon className="w-4 h-4" />
                <div>{point}</div>
              </div>
            ))}
          </div>
        </div>

        {/* super plan */}
        <div className="flex flex-col gap-y-4 w-[300px] bg-brand text-white rounded-2xl p-8 shadow-2xl">
          <div className="font-bold text-lg">Super</div>
          <div>
            <div className="text-2xl">$5~</div>
            <div className="text-sm font-normal">per month</div>
          </div>
          {/* description */}
          <div>This plan helps to maintain & support the platform.</div>

          {/* points */}
          <div className="space-y-1">
            {superPlansPoints.map((point) => (
              <div key={point} className="flex flex-row gap-x-2">
                <CheckIcon className="w-4 h-4" />
                <div>{point}</div>
              </div>
            ))}
          </div>

          {/* button */}
          <div className="mt-6 -mb-2 w-full">
            <GoSuperButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
