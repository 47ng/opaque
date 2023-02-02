import { Container, Divider } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { login, signup } from '../actions/auth'
import { AuthForm } from '../components/AuthForm'
import { Header } from '../components/Header'

const IndexPage: NextPage = () => {
  return (
    <>
      <Header />
      <Container as="main" maxW="md" mt={12} padding={4}>
        <AuthForm title="Sign up" onSubmit={signup} />
        <Divider my={8} />
        <AuthForm title="Log in" onSubmit={login} />
      </Container>
    </>
  )
}

export default IndexPage
