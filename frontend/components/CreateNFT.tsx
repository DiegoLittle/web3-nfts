import { Input } from '@chakra-ui/react'
import React, { useState } from 'react'

import UploadImage from './UploadImage'
const CreateNFT = ():React.ReactNode => {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')


  return (
    <div>
        {/* Title */}
        <Input 
        onChange={(e)=>{
          setTitle(e.target.value)
        }}
        placeholder='Title' />
        {/* Description */}
        <UploadImage />
    </div>
  )
}

export default CreateNFT