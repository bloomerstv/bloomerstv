export const CATEGORIES = [
  {
    name: 'None',
    tags: []
  },
  {
    name: 'Gaming',
    tags: ['gaming', 'orbcommunitiesgaming']
  },

  {
    name: 'Just chilling',
    tags: ['justchalling']
  },
  {
    name: 'Music',
    tags: ['music', 'orbcommunitiesMusic']
  },
  {
    name: 'Metaverse',
    tags: ['metaverse', 'orbcommunitiesmetaverse']
  },
  {
    name: 'Podcast',
    tags: ['podcast']
  },
  {
    name: 'Lens Ecosystem',
    tags: ['lens', 'orbcommunitieslens']
  },
  {
    name: 'Crypto & Blockchain',
    tags: ['crypto', 'orbcommunitiesDeFi', 'blockchain']
  },
  {
    name: 'Education',
    tags: ['education']
  },
  {
    name: 'Arts',
    tags: ['arts', 'orbcommunitiesrefraction']
  },
  {
    name: 'Coding & Tech',
    tags: [
      'developer',
      'tech',
      'programming',
      'coding',
      'orbcommunitiesDevelopers'
    ]
  },
  {
    name: 'Travel & Events',
    tags: ['travel', 'orbcommunitiestravel']
  },

  {
    name: 'Fashion & Beauty',
    tags: ['fashion', 'beauty', 'orbcommunitiesfashion']
  }
  // {
  //   name: 'Pets & Animals',
  //   tags: ['pets', 'orbcommunitiespets']
  // },
  // {
  //   name: 'Film & Animation',
  //   tags: ['film', 'orbcommunitiestvnfilms']
  // },
  // {
  //   name: 'Health & Fitness',
  //   tags: ['health', 'wellness', 'fitness', 'orbcommunitiesfitness']
  // },
  // {
  //   name: 'Comedy & Memes',
  //   tags: ['comedy', 'memes', 'orbcommunitiesmemes']
  // },
  // {
  //   name: 'Food & Cooking',
  //   tags: ['food', 'orbcommunitiesWhatsCooking']
  // },
  // {
  //   name: 'Sports',
  //   tags: ['sports']
  // },
  // {
  //   name: 'News & Politics',
  //   tags: ['news']
  // },

  // {
  //   name: 'Books & Literature',
  //   tags: ['literature', 'orbcommunities-t2/post']
  // },

  // {
  //   name: 'Howto & Style',
  //   tags: ['howto']
  // }
]

export const TOKEN_TAGS = [
  {
    symbol: 'pointless',
    tags: ['orbcommunitiespointless']
  },
  {
    symbol: 'BONSAI',
    tags: ['orbcommunitiesbonsai']
  }
]

export const CATEGORIES_LIST = CATEGORIES.map((category) => category.name)

export const getTagsForCategory = (category?: string) => {
  if (!category) return []
  const categoryObj = CATEGORIES.find((c) => c.name === category)
  return categoryObj?.tags ?? []
}

export const getTagsForSymbol = (symbol?: string) => {
  if (!symbol) return []
  const tokenObj = TOKEN_TAGS.find((c) => c.symbol === symbol)
  return tokenObj?.tags ?? []
}

export const getCategoryForTag = (tag?: string) => {
  if (!tag) return 'None'
  const categoryObj = CATEGORIES.find((c) => c.tags.includes(tag))
  return categoryObj?.name ?? 'None'
}
