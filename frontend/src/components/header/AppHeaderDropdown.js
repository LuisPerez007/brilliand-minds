import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar0 from '../../assets/images/avatars/0.png'
import { clearAccessToken } from '../../services/authSession'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const cerrarSesion = () => {
    clearAccessToken()
    navigate('/login', { replace: true })
  }

  return (
    <CDropdown variant="nav-item" className="profile-dropdown">
      <CDropdownToggle
        placement="bottom-end"
        className="profile-dropdown__toggle py-0 pe-0"
        caret={false}
      >
        <CAvatar src={avatar0} size="md" className="profile-dropdown__avatar" />
      </CDropdownToggle>
      <CDropdownMenu className="profile-dropdown__menu pt-0 shadow-sm" placement="bottom-end">
        <CDropdownHeader className="profile-dropdown__header fw-semibold mb-2">
          Configuración
        </CDropdownHeader>
        <CDropdownItem as="button" type="button" disabled className="profile-dropdown__item">
          <CIcon icon={cilUser} className="me-2 profile-dropdown__icon" />
          Perfil
        </CDropdownItem>
        <CDropdownItem as="button" type="button" disabled className="profile-dropdown__item">
          <CIcon icon={cilSettings} className="me-2 profile-dropdown__icon" />
          Ajustes
        </CDropdownItem>
        <CDropdownDivider className="profile-dropdown__divider" />
        <CDropdownItem
          as="button"
          type="button"
          onClick={cerrarSesion}
          className="profile-dropdown__item profile-dropdown__item--danger"
        >
          <CIcon
            icon={cilLockLocked}
            className="me-2 profile-dropdown__icon profile-dropdown__icon--danger"
          />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
