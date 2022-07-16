import { Box, Button, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useEffect, useReducer } from 'react'
import { YourContract as LOCAL_CONTRACT_ADDRESS, MyNFT as NFT_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import YourContract from '../artifacts/contracts/YourContract.sol/YourContract.json'
import MyNFTContract from '../artifacts/contracts/MyNFT.sol/MyNFT.json'
import { YourContract as YourContractType } from '../types/typechain'
import { setCookies,getCookie } from 'cookies-next';
import { gql, useQuery,useMutation } from '@apollo/client'

/**
 * Constants & Helpers
 */



const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

const ROPSTEN_CONTRACT_ADDRESS = '0xc15825c6A1478aaA6f3Db86eb0303d3E75e74a4E'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
  isLoading: boolean
}
type ActionType =
  | {
    type: 'SET_GREETING'
    greeting: StateType['greeting']
  }
  | {
    type: 'SET_INPUT_VALUE'
    inputValue: StateType['inputValue']
  }
  | {
    type: 'SET_LOADING'
    isLoading: StateType['isLoading']
  }

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
  isLoading: false,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_GREETING':
      return {
        ...state,
        greeting: action.greeting,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    default:
      throw new Error()
  }
}

const UserNonce = gql`
mutation user_nonce($address: String!) {
 user_nonce(address: $address) {
   nonce
 }
}
`
const AccessToken = gql`
mutation authenticate($signature: String!, $address: String!) {
  authenticate(signature: $signature, address: $address) {
    access_token
 }
}
`
const CreateNFT = gql`
mutation createNFT($user_address: String!, $hash: String!,$data: String!) {
  createNFT(user_address: $user_address, hash: $hash,data:$data) {
    id
    data
    hash
 }
}
`

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, chainId, library } = useEthers()
  const [getNonce,{data,loading,error}] = useMutation(UserNonce)
  const [getAccessToken] = useMutation(AccessToken)
  const [createNFT] = useMutation(CreateNFT)
  
  useEffect(() => {
    async function authenticate(signature) {
      const auth_request = await getAccessToken({variables:{
        address:account,
        signature:signature
      }})
      setCookies('access_token', auth_request.data.authenticate.access_token)
    }
    async function fetchNonce() {

      // const request = await fetch(`http://localhost:4000/${account}/nonce`)
      // const data = await request.json()
      // const nonce = data.nonce
      const nonce_request = await getNonce({variables:{
        address:account
      }})
      const nonce = nonce_request.data.user_nonce.nonce
      const signer = library.getSigner()
      const newSignature = await signer.signMessage(nonce.toString())
      authenticate(newSignature)
    }

    const cookie = getCookie('access_token')
    if (typeof (account) != 'undefined' && typeof (cookie) == 'undefined') {
      fetchNonce()
    }
  }, [account])

  const isLocalChain =
    chainId === ChainId.Localhost || chainId === ChainId.Hardhat
  const CONTRACT_ADDRESS =
    chainId === ChainId.Ropsten
      ? ROPSTEN_CONTRACT_ADDRESS
      : LOCAL_CONTRACT_ADDRESS
  // Use the localProvider as the signer to send ETH to our wallet
  const { sendTransaction } = useSendTransaction({
    signer: localProvider.getSigner(),
  })
  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (library) {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        YourContract.abi,
        library
      ) as YourContractType
      try {
        const data = await contract.greeting()
        dispatch({ type: 'SET_GREETING', greeting: data })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  async function mintNFT() {
    if (library) {
      const signer = library.getSigner()
      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        MyNFTContract.abi,
        signer
      )
      try {
        const data = await contract.mintNFT(account, "http://localhost:3000/test")
        // eslint-disable-next-line no-console
        console.log(data)
        const json_data = JSON.stringify(data)
        //TODO GraphQL mutation to create the NFT
        await createNFT({variables:{
          hash: data.hash,
          user_address: data.from,
          data: json_data
        }})
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  async function setContractGreeting() {
    if (!state.inputValue) return
    if (library) {
      dispatch({
        type: 'SET_LOADING',
        isLoading: true,
      })
      const signer = library.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        YourContract.abi,
        signer
      ) as YourContractType
      const transaction = await contract.setGreeting(state.inputValue)
      await transaction.wait()
      fetchContractGreeting()
      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
  }

  function sendFunds(): void {
    sendTransaction({
      to: account,
      value: utils.parseEther('0.1'),
    })
  }

  return (
    <Box>
      <Button
        onClick={() => {
          mintNFT()
        }}
        size="lg"
        colorScheme="red"
        variant="outline"
      >
        Mint Test NFT Page
      </Button>
      <Text mt="8" fontSize="xl">
        This page only works on the ROPSTEN Testnet or on a Local Chain.
      </Text>
    </Box>
  )
}

export default HomeIndex
