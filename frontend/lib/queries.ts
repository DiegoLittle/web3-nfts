import { gql } from "@apollo/client";

export const getPresignedURL = gql`
query getPresignedURL($filename: String!) {
    getPresignedURL(filename: $filename)
}
`