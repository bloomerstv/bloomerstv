export const getSenitizedContent = (content: string, title: string) => {
  let newContent = content

  if (content.startsWith(title)) {
    newContent = content.replace(title, '')
  }

  if (content.startsWith(`**${title}**`)) {
    newContent = content.replace(`**${title}**`, '')
  }

  // remove \n from begining or ends
  newContent = newContent.trim()

  return newContent
}
