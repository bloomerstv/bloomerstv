import React from 'react'

const page = ({
  params
}: {
  params: {
    slug: string
  }
}) => {
  return <div>profile page: slug - {params.slug}</div>
}

export default page
