// ** React Imports
import { ReactNode, useEffect, Fragment } from 'react'

// ** Redux Imports
import { useDispatch } from 'react-redux'

// ** Third-Party Imports
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

// ** Action Imports
import { setGlobalSocket, setSocketConnection } from 'src/store/dashboard'

// ** Config Imports
import authConfig from 'src/configs/auth'

interface Props {
  children: ReactNode
}

const SocketInitializer = (props: Props) => {
  // ** Props
  const { children } = props

  // ** Hooks
  const dispatch = useDispatch()

  // ** Side Effects
  useEffect(() => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      auth: {
        stragey: 'apiToken',
        token: storedToken
      }
    })

    dispatch(setGlobalSocket(socketInstance))

    const onConnect = () => {
      dispatch(setSocketConnection(true))
    }
    const onConnectError = (error: Error) => {
      toast.error(error.message)

      dispatch(setSocketConnection(false))
      socketInstance.disconnect()
    }
    const onDisconnect = () => {
      dispatch(setSocketConnection(false))
    }

    socketInstance.on('connect', onConnect)
    socketInstance.on('connect_error', onConnectError)
    socketInstance.on('disconnect', onDisconnect)

    return () => {
      socketInstance.off('connect', onConnect)
      socketInstance.off('connect_error', onConnectError)
      socketInstance.off('disconnect', onDisconnect)
    }
  }, [dispatch])

  return <Fragment>{children}</Fragment>
}

export default SocketInitializer
