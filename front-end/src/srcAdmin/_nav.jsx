import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Manager',
  },
  {
    component: CNavItem,
    name: 'Product',
    to: '/admin/product',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Base',
    to: '/admin/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tables',
        to: '/admin/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tabs',
        to: '/admin/base/tabs',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/admin/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/admin/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/admin/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/admin/buttons/dropdowns',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/admin/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/admin/forms/select',
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/admin/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/admin/forms/range',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/admin/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/admin/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/admin/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/admin/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/admin/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/admin/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
