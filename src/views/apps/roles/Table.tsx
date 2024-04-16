// ** React Imports
import { useEffect, useCallback, useState } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Core Component Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Custom Component Imports
import TableHeader from 'src/views/apps/roles/TableHeader'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Action Imports
import { fetchData } from 'src/store/apps/user'

// ** Util Imports
import { getInitials } from 'src/@core/utils/get-initials'
import { getUserRoleAttributes } from 'src/utils'

// ** Type Imports
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import { ThemeColor } from 'src/@core/layouts/types'

interface UserStatusType {
  [key: string]: ThemeColor
}
interface CellType {
  row: UsersType
}

const UserList = () => {
  // ** States
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  // ** Vars
  const userStatusObj: UserStatusType = {
    active: 'success',
    pending: 'warning',
    inactive: 'secondary'
  }
  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }: CellType) => {
        const { fullName, username } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                variant='subtitle2'
                href='/apps/user/view/overview/'
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {fullName}
              </Typography>
              <Typography noWrap variant='caption'>
                {`@${username}`}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2' noWrap>
          {row.email}
        </Typography>
      )
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 150,
      headerName: 'Role',
      renderCell: ({ row }: CellType) => {
        const userRoleAttributes = getUserRoleAttributes(row.role as any)

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 3, color: `${userRoleAttributes.color}.main` }
            }}
          >
            <Icon icon={userRoleAttributes.icon} fontSize={20} />
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.role}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Plan',
      field: 'currentPlan',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
          {row.currentPlan}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => (
        <CustomChip
          skin='light'
          size='small'
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => (
        <IconButton component={Link} href='/apps/user/view/overview/'>
          <Icon icon='mdi:eye-outline' />
        </IconButton>
      )
    }
  ]

  // ** Logics
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  // ** renders client column
  const renderClient = (row: UsersType) => {
    if (row.avatar.length) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
    } else {
      return (
        <CustomAvatar skin='light' color={row.avatarColor} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
          {getInitials(row.fullName ? row.fullName : 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  // ** Side Effects
  useEffect(() => {
    dispatch(
      fetchData({
        role: '',
        q: value,
        status: '',
        currentPlan: plan
      })
    )
  }, [dispatch, plan, value])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader plan={plan} value={value} handleFilter={handleFilter} handlePlanChange={handlePlanChange} />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
