import { gql,useLazyQuery } from '@apollo/client'
import { Input,Box,Text, Button} from '@chakra-ui/react'
import React, { useState } from 'react'

import UploadImage from '../components/UploadImage'

const getPresignedURL = gql`
query getPresignedURL($filename: String!) {
    getPresignedURL(filename: $filename)
}
`

const CreateNFT = ():React.ReactNode => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [getURL, { loading, error, data }] = useLazyQuery(getPresignedURL,{
    onCompleted: (data) => {
        uploadImage(data)
      }
  });

    const uploadImage=async(data)=>{
        let url = data.getPresignedURL
        const formData = new FormData();
        formData.append("file", file);
        const myHeaders = { 'Content-Type': file.type }
        const response = await fetch(url, {
            method: "PUT",
            headers: myHeaders,
            body: file
          });
        let s3_url = "https://web3-nfts.s3.us-east-1.amazonaws.com/" + file.name
        setImageUrl(s3_url)
        
    
        // POST to presigned URL

    }
    const handleFile = async (file: File) => {
        
        setFile(file)
        getURL({variables:{filename:file.name}})
    }


  return (
    <div>
        {/* Title */}
        <Box
        width={"25%"}
        >
          <Text
          fontSize="4xl"
          fontWeight="bold"
          marginBottom={4}
          >Mint an NFT</Text>
        <Input 
        _focus={{outlineColor:"orange.300"}}
        type="text"
        onChange={(e)=>{
          setTitle(e.target.value)
        }}
        placeholder='Title' />
        <Input 
        _focus={{outlineColor:"orange.300"}}
        type="text"
        marginY="5"
        onChange={(e)=>{
          setDescription(e.target.value)
        }}
        placeholder='Description' />
        </Box>
        {/* Description */}
        <Box>
        <UploadImage upload={handleFile} />
        </Box>
        <Button
        backgroundColor={'orange.300'} 
        _hover={{backgroundColor:'orange.400'}}
        width={'25%'}
        marginTop={4}
        >
          Mint
        </Button>
    </div>
  )
}

export default CreateNFT