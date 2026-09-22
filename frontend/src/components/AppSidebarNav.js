import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { obtenerRol } from '../views/utils/usuario'

export const AppSidebarNav = ({ items }) => {
  const rol = obtenerRol()

  const filtrarItems = (itemsToFilter) =>
    itemsToFilter
      .filter((item) => !item.roles || item.roles.includes(rol))
      .map((item) => {
        if (!item.items) {
          return item
        }

        const itemsFiltrados = filtrarItems(item.items)
        return itemsFiltrados.length ? { ...item, items: itemsFiltrados } : null
      })
      .filter(Boolean)

  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    const itemKey = rest.to || rest.href || name
    return (
      <Component as="div" key={itemKey}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    const itemKey = to || name
    return (
      <Component compact as="div" key={itemKey} toggler={navLink(name, icon)} {...rest}>
        {items?.map((item) => (item.items ? navGroup(item) : navItem(item, true)))}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items && filtrarItems(items).map((item) => (item.items ? navGroup(item) : navItem(item)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
