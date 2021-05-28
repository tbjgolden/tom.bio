const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
})

module.exports = {
  future: {
    webpack5: true
  },
  ...withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
  })
}
