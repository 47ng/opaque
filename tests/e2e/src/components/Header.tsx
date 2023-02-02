import { Flex, FlexProps, Heading, Icon } from '@chakra-ui/react'
import React from 'react'
import { FiShield } from 'react-icons/fi'
import { ColorModeSwitch } from './ColorModeSwitch'

interface HeaderProps extends FlexProps {}

export const Header: React.FC<HeaderProps> = ({ ...props }) => {
  return (
    <Flex as="header" alignItems="center" pl={4} pr={2} py={1} {...props}>
      <Heading as="h2" fontSize="md">
        <Icon as={FiShield} mr={2} transform="translateY(2px)" />
        OPAQUE Demo
      </Heading>
      <ColorModeSwitch ml="auto" />
    </Flex>
  )
}
