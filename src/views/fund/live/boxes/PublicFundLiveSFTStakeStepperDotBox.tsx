// ** MUI Imports
import MuiBox from '@mui/material/Box'
import { alpha, styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import type { BoxProps } from '@mui/material/Box'
import type { StepIconProps } from '@mui/material/StepIcon'

// ** Styled Box component
const Box = styled(MuiBox)<BoxProps>(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const PublicFundLiveSFTStakeStepperDotBox = (props: StepIconProps) => {
  // ** Props
  const { active, completed, error } = props

  // ** Hooks
  const theme = useTheme()

  if (error) {
    return <Icon icon='mdi:alert' fontSize={20} color={theme.palette.error.main} transform='scale(1.2)' />
  } else if (completed) {
    return <Icon icon='mdi:check-circle' fontSize={20} color={theme.palette.primary.main} transform='scale(1.2)' />
  } else {
    return (
      <Box
        sx={{
          borderColor: active ? 'primary.main' : alpha(theme.palette.primary.main, 0.3)
        }}
      />
    )
  }
}

export default PublicFundLiveSFTStakeStepperDotBox
