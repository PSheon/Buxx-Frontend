// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { Role } from 'src/context/types'

interface UserRoleAttributeType {
  [key: string]: {
    icon: string
    color: ThemeColor
    displayName: string
    description: string
  }
}

export const getUserRoleAttributes = (role: Role) => {
  const userRoleAttributes: UserRoleAttributeType = {
    Admin: {
      icon: 'mdi:laptop',
      color: 'primary',
      displayName: '系統管理員',
      description: '監控管理系統並確保所有事物都在正常運作'
    },
    Planner: {
      icon: 'mdi:chart-donut',
      color: 'info',
      displayName: '規劃者',
      description: '規劃和管理所有專案'
    },
    'Asset Manager': {
      icon: 'mdi:rate-review',
      color: 'warning',
      displayName: '資產管理員',
      description: '管理特定專案'
    },
    User: {
      icon: 'mdi:user-outline',
      color: 'success',
      displayName: '使用者',
      description: '查看專案的進度和資訊以及進行質押'
    },
    Public: {
      icon: 'mdi:public',
      color: 'secondary',
      displayName: '公開',
      description: '未登入的使用者'
    }
  }

  return userRoleAttributes[role]
}
