import React, { useState } from 'react'
import { Box, Button, Divider, Grid, GridItem, Heading, Input, Text } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'


const Home = () => {

    const [showcaseCollection, setShowcaseCollection] = useState([
        {
            name: 'Showcase 1',
        }
    ]);

    return (
        <Layout>
            <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                {showcaseCollection.map((item, index) => (
                    <GridItem key={index} w='100%' h='56' bg='blue.500' >
                        <Text padding={3} fontSize='2xl'>{item.name}</Text>
                        
                    </GridItem>
                ))}
            </Grid>
        </Layout>
    )
}

export default Home