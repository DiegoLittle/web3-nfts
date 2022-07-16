import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'

import {
  ChainId,
  Config,
  DAppProvider,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unused variable
  MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { MulticallContract } from '../artifacts/contracts/contractAddress'
import { useApollo } from '../lib/apolloClient'
import Layout from '../components/layout/Layout'
import { store } from '../store'
import { Provider } from 'react-redux'
// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = 'a38613e5838d473f9bd10b9e11245841'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Goerli,
    ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    ChainId.xDai,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
    [ChainId.Hardhat]: MulticallContract,
    [ChainId.Localhost]: MulticallContract,
  },
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <Provider store={store}>
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
        <ChakraProvider>
          <Layout>
          <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </DAppProvider>
    </ApolloProvider>
    </Provider>
  )
}

export default MyApp
