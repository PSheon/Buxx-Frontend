// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

// ** Core Component Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Hook Imports
import { useInterval } from 'src/hooks/useInterval'

// ** Util Imports
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Type Imports
import type { ApexOptions } from 'apexcharts'
import type { RootState } from 'src/store'

interface Props {
  checkInterval?: number
}

interface CPUInfo {
  model: string
  count: string
  usagePercentageHistory: number[]
}

const SystemDashboardCpuUsageStatisticsLineChartCard = (props: Props) => {
  // ** Props
  const { checkInterval = 5_000 } = props

  // ** States
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const [cpuInfoData, setCpuInfoData] = useState<CPUInfo>({
    model: '',
    count: '',
    usagePercentageHistory: []
  })

  // ** Hooks
  const theme = useTheme()
  const isSocketConnected = useSelector((state: RootState) => state.dashboard.isSocketConnected)
  const socket = useSelector((state: RootState) => state.dashboard.socket)

  // ** Vars
  const usagePercentageHistory = cpuInfoData.usagePercentageHistory

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      }
    },
    tooltip: { enabled: false },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -15,
        left: -7,
        right: 7,
        bottom: -15
      }
    },
    stroke: { width: 3 },
    colors: [hexToRGBA(theme.palette.info.main, 1)],
    markers: {
      size: 6,
      offsetY: 2,
      offsetX: -1,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 6,
          seriesIndex: 0,
          strokeColor: theme.palette.info.main,
          fillColor: theme.palette.background.paper,
          dataPointIndex: usagePercentageHistory.length - 1
        }
      ],
      hover: { size: 7 }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    }
  }

  // ** Side Effects
  useInterval(() => {
    if (isSocketConnected) {
      socket!.emit('dashboard:get-cpu-info')
    }
  }, checkInterval)
  useEffect(() => {
    if (isSocketConnected) {
      socket?.on('dashboard:cpu-info', (cpuInfo: CPUInfo) => {
        if (!isInitialized) {
          setIsInitialized(true)
        }

        setCpuInfoData(() => cpuInfo)
      })
    }

    return () => {
      socket?.off('dashboard:cpu-info')
    }
  }, [socket, isSocketConnected, isInitialized])

  return (
    <Card>
      <CardContent>
        {isInitialized ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='h6' color='success.main' sx={{ mr: 1.5 }}>
              {`${usagePercentageHistory[usagePercentageHistory.length - 1]}%`}
            </Typography>
            <Typography variant='subtitle2'>{`${cpuInfoData.model} ${cpuInfoData.count} Core`}</Typography>
          </Box>
        ) : (
          <Skeleton variant='rounded' width={160} height={24} sx={{ mb: 2 }} />
        )}
        <Typography variant='body2'>CPU 使用率</Typography>
        {isInitialized ? (
          <ReactApexcharts type='line' height={108} options={options} series={[{ data: usagePercentageHistory }]} />
        ) : (
          <Skeleton variant='rounded' height={100} sx={{ mt: 1 }} />
        )}
      </CardContent>
    </Card>
  )
}

export default SystemDashboardCpuUsageStatisticsLineChartCard
