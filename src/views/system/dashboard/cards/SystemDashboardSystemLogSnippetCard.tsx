// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'

// ** Third-Party Imports
import { format } from 'date-fns'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useInterval } from 'src/hooks/useInterval'

// ** Type Imports
import type { RootState } from 'src/store'

interface Props {
  checkInterval?: number
}
interface SystemLog {
  system: string
}

const SystemDashboardSystemLogSnippetCard = (props: Props) => {
  // ** Props
  const { checkInterval = 5_000 } = props

  // ** States
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const [systemLogData, setSystemLogData] = useState<SystemLog>({
    system: ''
  })

  // ** Hooks
  const isSocketConnected = useSelector((state: RootState) => state.dashboard.isSocketConnected)
  const socket = useSelector((state: RootState) => state.dashboard.socket)

  // ** Logics
  const handleRefetchOSInfo = () => {
    if (isSocketConnected) {
      setIsInitialized(false)
      socket!.emit('dashboard:get-system-log')
    }
  }

  // ** Side Effects
  useInterval(() => {
    if (isSocketConnected) {
      socket!.emit('dashboard:get-system-log')
    }
  }, checkInterval)
  useEffect(() => {
    if (isSocketConnected) {
      socket?.on('dashboard:system-log', (systemLog: SystemLog) => {
        if (!isInitialized) {
          setIsInitialized(true)
        }

        setSystemLogData(() => systemLog)
      })
    }

    return () => {
      socket?.off('dashboard:os-info')
    }
  }, [socket, isSocketConnected, isInitialized])

  return (
    <Card>
      <CardHeader
        title='系統紀錄'
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <IconButton
            size='small'
            aria-label='collapse'
            sx={{ color: 'text.secondary' }}
            disabled={!isInitialized}
            onClick={() => handleRefetchOSInfo()}
          >
            <Icon icon='mdi:refresh' fontSize={20} />
          </IconButton>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='caption' sx={{ mr: 1.5 }}>
              日誌檔案
            </Typography>
            <Typography variant='subtitle2' color='info.main'>
              {`${format(new Date(), 'yyyy-MM-dd-HH')}.log`}
            </Typography>
          </Box>
        }
      />
      <CardContent className='match-height'>
        {isInitialized ? (
          <pre className='language-tsx'>
            <code className='language-tsx'>{systemLogData.system}</code>
          </pre>
        ) : (
          <Skeleton variant='rounded' height={360} />
        )}
      </CardContent>
    </Card>
  )
}

export default SystemDashboardSystemLogSnippetCard
