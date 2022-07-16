import { gql } from "@apollo/client";

// user_address: data.from,
// title: title,
// description: description,
// image_url: imageUrl,
export const CreateNFT = gql`
mutation createNFT(
  $user_address: String!,
   $title: String!,
   $description: String!,
    $image_url: String!,
   ) {
  createNFT(user_address: $user_address, title: $title,description:$description,image_url:$image_url) {
    id
 }
}
`
export const UpdateNFTContract = gql`
mutation updateNFTContract(
  $id: String!,
  $hash: String!,
   $data: String!
   ) {
  updateNFTContract(id:$id,hash: $hash, data: $data) {
    id
 }
}`

export const AccessToken = gql`
mutation authenticate($signature: String!, $address: String!) {
  authenticate(signature: $signature, address: $address) {
    access_token
 }
}
`

export const UserNonce = gql`
mutation user_nonce($address: String!) {
 user_nonce(address: $address) {
   nonce
 }
}
`
