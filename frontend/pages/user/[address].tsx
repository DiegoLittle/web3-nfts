import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Box } from '@chakra-ui/react'
import NFT from '../../components/NFT'

const getNFTS = gql`
query getNFTs($user_address: String!) {
  getNFTs(user_address: $user_address) {
    id
    data
    hash
    image_url
    title
    description
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
    return (
        <Box display="flex" >{
            data.getNFTs.map((nft,index)=>{
              return (
                <NFT 
                key={index}
                {...nft}
                />
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