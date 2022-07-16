import { useLazyQuery, useMutation } from '@apollo/client'
import { Input, Box, Text, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import Image from 'next/image'
import { getPresignedURL } from '../lib/queries'
import { CreateNFT, UpdateNFTContract } from '../lib/mutations'
import UploadImage from '../components/UploadImage'
import {  useEthers } from '@usedapp/core'
import { ethers} from 'ethers'
import {  MyNFT as NFT_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import MyNFTContract from '../artifacts/contracts/MyNFT.sol/MyNFT.json'



const CreateNFTPage = (): React.ReactNode => {
  const { account,  library } = useEthers()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [createNFT] = useMutation(CreateNFT)
  const [updateNFTContract] = useMutation(UpdateNFTContract)
  const [errorMessage, setErrorMessage] = useState<string>('')


  const [getURL] = useLazyQuery(getPresignedURL, {
    onCompleted: (data) => {
      uploadImage(data)
    }
  });

  const uploadImage = async (data) => {
    const url = data.getPresignedURL
    const formData = new FormData();
    formData.append("file", file);
    const myHeaders = { 'Content-Type': file.type }
     await fetch(url, {
      method: "PUT",
      headers: myHeaders,
      body: file
    });
    const s3_url = "https://web3-nfts.s3.us-east-1.amazonaws.com/" + file.name
    setImageUrl(s3_url)


    // POST to presigned URL

  }
  const handleFile = async (file: File) => {
    setFile(file)
    getURL({ variables: { filename: file.name } })
  }



  async function mintNFT() {
    if(!account) {
      setErrorMessage("Please connect to your wallet")
      return
    }
    const created_nft = await createNFT(
    {variables:{
    user_address: account,
    title: title,
    description: description,
    image_url: imageUrl,
  }})
  const nft_id = created_nft.data.createNFT.id
  const tokenURI = process.env.NEXT_PUBLIC_API_URL+"/tokens/"+nft_id
  // create REST API endpoint to fetch NFTs /token/:id
    if (library) {
      const signer = library.getSigner()
      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        MyNFTContract.abi,
        signer
      )
      try {
        const data = await contract.mintNFT(account, tokenURI)
        // eslint-disable-next-line no-console
        console.log(data)
        const json_data = JSON.stringify(data)
        // Update NFT record in GraphQL with transaction data
        await updateNFTContract({
          variables: {
            id: nft_id,
            hash: data.from,
            data: json_data,
          }
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }


  return (
    <Box
    marginLeft={{ base: 0, md:8, lg: 0 }}
    marginX={{ base: 8, }}
    >
      {/* Title */}
      <Box

        width={{ base: '100%', md: '50%', lg: '25%' }}
      >
        <Text
          fontSize="4xl"
          fontWeight="bold"
          marginBottom={4}
        >Mint an NFT</Text>
        <Input
          _focus={{ outlineColor: "orange.300" }}
          type="text"
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          placeholder='Title' />
        <Input
          _focus={{ outlineColor: "orange.300" }}
          type="text"
          marginY="5"
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          placeholder='Description' />
      </Box>
      {/* Description */}
      <Box 
      
        width={{ base: '100%', md: '50%', lg: '25%' }}
      display={'flex'}
      justifyContent='center'
      >
        {imageUrl ?
          (
            <div style={{
              borderRadius: '10px'
              ,overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <Image
            width={'100%'}
            height={'100%'}
              src={imageUrl}
               />
               </div>
          ) :
          (
            <UploadImage upload={handleFile} />
          )

        } 
        </Box>
        {errorMessage && (
      <Box 
      borderRadius={10}
      marginTop={4}
      width={{ base: '100%', md: '50%', lg: '25%' }}
      bgColor="red.100"
      padding={4}
      >
        <Text textAlign={'center'} fontSize={14}>{errorMessage}</Text>
      </Box>
      )}
      <Button
      onClick={()=>{
        mintNFT()
      }}
        backgroundColor={'orange.300'}
        _hover={{ backgroundColor: 'orange.400' }}
        width={{ base: '100%', md: '50%', lg: '25%' }}
        marginTop={4}
      >
        Mint
      </Button>
    </Box>
  )
}

export default CreateNFTPage