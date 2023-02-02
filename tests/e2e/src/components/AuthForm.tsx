import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { z } from 'zod'

interface AuthFormProps extends Omit<BoxProps, 'onSubmit'> {
  title: string
  onSubmit(values: AuthFormValues): Promise<void>
}

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
})
export type AuthFormValues = z.infer<typeof formSchema>

const initialValues: AuthFormValues = {
  username: '',
  password: '',
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  onSubmit,
  ...props
}) => {
  const { register, handleSubmit, formState, reset } = useForm<AuthFormValues>({
    defaultValues: initialValues,
  })
  const { isOpen: isPasswordVisible, onToggle: togglePasswordVisible } =
    useDisclosure()
  const _onSubmit = React.useCallback(
    async (values: AuthFormValues) => {
      await onSubmit(values)
      reset(initialValues)
    },
    [onSubmit, reset]
  )
  return (
    <Box {...props}>
      <Stack as="form" onSubmit={handleSubmit(_onSubmit)} spacing={4}>
        <Heading as="h1">{title}</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input {...register('username')} placeholder="alice@example.com" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              {...register('password')}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="••••••••••••••••••••"
            />
            <InputRightElement>
              <IconButton
                aria-label="Show/hide password"
                icon={isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                onClick={togglePasswordVisible}
                size="sm"
                rounded="full"
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          type="submit"
          colorScheme="green"
          isLoading={formState.isSubmitting}
        >
          {title}
        </Button>
      </Stack>
    </Box>
  )
}
