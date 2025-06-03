import React from 'react'
import { Typography } from '@mui/material'
import { Construction, Rocket, RotateCcw, Mail, Github, Twitter, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import {
  CREATOR_EMAIL,
  DISCORD_INVITE_URL,
  GITHUB_URL,
  HEY_URL,
  X_URL
} from '../../utils/config'

const MigrationNotice: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-p-bg to-s-bg p-4 sm:p-6">
      <div className="max-w-3xl w-full bg-s-bg/80 backdrop-blur-sm rounded-xl shadow-2xl p-5 sm:p-8 border border-p-accent/20">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="mb-4 relative h-16 w-16 sm:h-20 sm:w-20">
            <Image
              src="/apple-icon.png"
              alt="BloomersTV Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/icon-192x192.png' // Fallback image
              }}
            />
          </div>

          <Typography
            variant="h4"
            className="text-center font-bold text-p-accent mb-2 text-xl sm:text-2xl"
          >
            BloomersTV is Upgrading to Lens V3
          </Typography>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Construction className="text-yellow-500" />
            <Typography
              variant="subtitle1"
              className="text-s-text text-sm sm:text-base"
            >
              Maintenance in Progress
            </Typography>
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div className="bg-p-bg/30 p-3 sm:p-4 rounded-lg space-y-4 border border-p-accent/10">
            <div className="flex items-center mb-3">
              <RotateCcw className="text-blue-400 mr-2 flex-shrink-0" />
              <Typography
                variant="body1"
                className="text-p-text font-medium text-sm sm:text-base"
              >
                We're Currently Upgrading
              </Typography>
            </div>
            <Typography
              variant="body2"
              className="text-s-text mb-6 pl-7 text-xs sm:text-sm"
            >
              Thank you for your patience as we migrate BloomersTV to Lens V3
              and Lens Chain. This process may take some time, but we're working
              diligently to bring you an improved experience.
            </Typography>

            <div className="flex items-center mb-3">
              <Rocket className="text-purple-400 mr-2 flex-shrink-0" />
              <Typography
                variant="body1"
                className="text-p-text font-medium text-sm sm:text-base"
              >
                Coming Back Stronger
              </Typography>
            </div>
            <Typography
              variant="body2"
              className="text-s-text pl-7 text-xs sm:text-sm"
            >
              While there was a temporary slowdown in development, BloomersTV
              will be returning with a bang! We're building exciting new
              features and improvements that will enhance your experience
              significantly.
            </Typography>
          </div>

          <div className="flex flex-col items-center mt-6 sm:mt-8 space-y-4">
            <Typography
              variant="h6"
              className="text-center text-p-accent mb-2 text-base sm:text-lg"
            >
              Stay tuned for updates!
            </Typography>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-p-bg/50 hover:bg-p-bg transition text-s-text hover:text-p-text text-xs sm:text-sm border border-p-accent/10"
              >
                <Twitter className="text-blue-400" />
                <span>Twitter</span>
              </a>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-p-bg/50 hover:bg-p-bg transition text-s-text hover:text-p-text text-xs sm:text-sm border border-p-accent/10"
              >
                <MessageSquare className="text-indigo-400" />
                <span>Discord</span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-p-bg/50 hover:bg-p-bg transition text-s-text hover:text-p-text text-xs sm:text-sm border border-p-accent/10"
              >
                <Github className="text-gray-400" />
                <span>GitHub</span>
              </a>

              <a
                href={HEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-p-bg/50 hover:bg-p-bg transition text-s-text hover:text-p-text text-xs sm:text-sm border border-p-accent/10"
              >
                <span className="text-purple-400 font-bold">Hey</span>
              </a>
            </div>

            <div className="mt-4 flex flex-col items-center">
              <Typography
                variant="body2"
                className="text-s-text text-xs sm:text-sm mb-2"
              >
                Contact Creator:
              </Typography>
              <a
                href={`mailto:${CREATOR_EMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-p-accent/20 border border-p-accent/30 text-p-accent hover:bg-p-accent/30 transition-colors"
              >
                <Mail />
                <span className="font-medium select-all">{CREATOR_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Typography
        variant="caption"
        className="mt-6 sm:mt-8 text-s-text/60 text-xs"
      >
        &copy; {new Date().getFullYear()} BloomersTV • All rights reserved
      </Typography>
    </div>
  )
}

export default MigrationNotice
