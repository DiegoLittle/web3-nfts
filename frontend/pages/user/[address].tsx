import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { Box,Text } from '@chakra-ui/react'

const getNFTS = gql`
query getNFTs($user_address: String!) {
  getNFTs(user_address: $user_address) {
    id
    data
    hash
 }
}
`

const User = ({address}) => {
    const {loading,error,data} = useQuery(getNFTS,{
        variables:{
            user_address:address
        }
    })
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    console.log(data)
    return (
        <Box display="flex" >{
            data.getNFTs.map((nft,index)=>{
              return (
                <Box 
                border="1px"
                borderColor='gray.200'
                padding={4}
                marginX="4"
                borderRadius={12}
                width={"25%"}
                key={index}>
                  <Text>From: {nft.hash}</Text>
                </Box>
              )
            })
            }</Box>
    )
}

export default User

interface Props {
    address: string
}

export function getServerSideProps(ctx): { props: Props } {
    const { address } = ctx.query
    return {
        props: {
            address: address
        }
    }
}