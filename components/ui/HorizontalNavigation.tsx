import clsx from 'clsx'
import { motion } from 'framer-motion'
import { ReactNode, useMemo, useState } from 'react'

const HorizontalNavigation = ({
  navItems,
  navClassName
}: {
  navItems: {
    name: string
    component: string
    render: () => ReactNode
  }[]
  navClassName?: string
}) => {
  const [selectedComponent, setSelectedComponent] = useState(
    navItems[0].component
  )

  const renderedComponent = useMemo(() => {
    const selectedItem = navItems.find(
      (item) => item.component === selectedComponent
    )
    return selectedItem ? selectedItem.render() : null
  }, [selectedComponent, navItems])

  return (
    <div>
      <div className={clsx('relative flex space-x-8', navClassName)}>
        {navItems.map((item, index) => (
          <div
            key={index}
            className="relative cursor-pointer p-2"
            onClick={() => setSelectedComponent(item.component)}
          >
            <span
              className={`pb-2 font-semibold ${selectedComponent === item.component ? 'border-b-2 border-brand text-brand' : ''}`}
            >
              {item.name}
            </span>
            {selectedComponent === item.component && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-brand"
                layoutId="underline"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">{renderedComponent}</div>
    </div>
  )
}

export default HorizontalNavigation
