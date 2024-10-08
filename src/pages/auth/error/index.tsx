// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Imports
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Custom Component Imports
import FooterIllustrations from 'src/views/shared/misc/FooterIllustrations'

// ** Type Imports
import type { ReactNode } from 'react'
import type { BoxProps } from '@mui/material/Box'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))

const AuthErrorPage = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            Error
          </Typography>
          <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            Something went wrong!
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/401.png' />
        <Button href='/' component={Link} variant='contained' sx={{ px: 5.5 }}>
          Go Back
        </Button>
      </Box>
      <FooterIllustrations image='/images/pages/misc-401-object.png' />
    </Box>
  )
}

AuthErrorPage.authGuard = false
AuthErrorPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default AuthErrorPage
