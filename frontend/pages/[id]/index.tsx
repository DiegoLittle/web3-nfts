import React from 'react'

const index = ({id}) => {
    return (
        <div>{id}</div>
    )
}

export default index

interface Props {
    id: string
}

export function getServerSideProps(ctx): { props: Props } {
    const { id } = ctx.query
    return {
        props: {
            id: id
        }
    }
}