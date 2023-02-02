import { Container } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { signup } from '../actions/auth'
import { AuthForm } from '../components/AuthForm'
import { Header } from '../components/Header'

const IndexPage: NextPage = () => {
  return (
    <>
      <Header />
      <Container as="main" maxW="md" mt={12} padding={4}>
        <AuthForm title="Sign up" onSubmit={signup} />
      </Container>
    </>
  )
}

export default IndexPage
