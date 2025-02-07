import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//management
const UserManager = React.lazy(() => import('./views/UserManager/UserManager'))
const ColorManager = React.lazy(() => import('./views/ColorManager/ColorManager'))
const BrandManager = React.lazy(() => import('./views/BrandManager/BrandManager'))
const ServiceManager = React.lazy(() => import('./views/ServiceManager/ServiceManager'))
const CategoryManager = React.lazy(() => import('./views/CategoryManager/CategoryManager'))
const ProductManager = React.lazy(() => import('./views/ProductManager/ProductManager'))
const OrderManager = React.lazy(() => import('./views/OrderManager/OrderManager'))
const ReviewManager = React.lazy(() => import('./views/ReviewManager/ReviewManager'))
const ContactManager = React.lazy(() => import('./views/ContactManager/ContactManager'))

// Base
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [

  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/user', name: 'User', element: UserManager },
  { path: '/color', name: 'Color', element: ColorManager },
  { path: '/brand', name: 'Brand', element: BrandManager },
  { path: '/category', name: 'Category', element: CategoryManager },
  { path: '/service', name: 'Service', element: ServiceManager },
  { path: '/product', name: 'Product', element: ProductManager },
  { path: '/order', name: 'Order', element: OrderManager },
  { path: '/review', name: 'Review', element: ReviewManager },
  { path: '/contact', name: 'Contact', element: ContactManager },

  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },

  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
