import { Box,Image,Text } from '@chakra-ui/react'
import React from 'react'

const NFT = ({image_url,title,description}) => {
  return (
<Box 
    border="1px"
    borderColor='gray.200'
    padding={4}
    marginX="4"
    borderRadius={12}
    width={"25%"}
    >
        <Image src={image_url}  />
        <Text fontSize="3xl" fontWeight={"bold"} marginTop={4}>{title}</Text>
        <Text fontSize={"lg"} color="gray.600">{description}</Text>
    </Box>
  )
}

export default NFT