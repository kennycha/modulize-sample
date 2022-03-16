const getSplitedFileName = (fileName: string) => {
  const idx = fileName.lastIndexOf('.')
  return [fileName.slice(0, idx), fileName.slice(idx + 1)]
}

export default getSplitedFileName