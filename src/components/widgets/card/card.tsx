import React from 'react'

import { Box } from '../box'
import { ViewProps } from '@/shared/types'

export const Card: React.FC<ViewProps> = function (props) {
  return (
    <Box
      backgroundColor="background"
      borderRadius={4}
      shadowColor="black"
      shadowOffset={{
        width: 0,
        height: 0,
      }}
      shadowOpacity={0.5}
      shadowRadius={1}
      elevation={5}
      {...props}
    />
  )
}
