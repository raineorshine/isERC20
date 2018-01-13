const Nightmare = require('nightmare')
const chalk = require('chalk')

const token = process.argv[2]

// validate token arg
if (!token) {
  console.log('Please specify a token on the command line.')
  process.exit(1)
}

console.log(`Is ${token} an ERC20 token? Let us see...`)

// generate url
const url = 'https://coinmarketcap.com/currencies/search/?q=' + token
console.log(`Querying ${url}... `)

Nightmare()
  .goto(url)
  .evaluate(() => {
    // get Explorer link
    // return true if the token has an etherscan Explorer, i.e. is an ERC20 token
    const explorerUrl = document.querySelector('[title=Explorer]').nextSibling.nextSibling.href
    return explorerUrl.startsWith('https://etherscan.io') ? explorerUrl : null
  })
  .end()
  .then(explorerUrl => {
    console.log(explorerUrl ?
      `${chalk.green('yes')}, ${token} is an ERC20 token.\n${explorerUrl}` :
      `${chalk.red('no')}, ${token} is not an ERC20 token.`
    )
  })
