'use client'

import { useSidebar } from "@/components/ui/sidebar"
import MenuIcon from '@mui/icons-material/Menu';

export function CustomTrigger() {
  const { toggleSidebar, isMobile } = useSidebar()

  return (isMobile ? <button onClick={toggleSidebar}><MenuIcon/></button> : <div></div>)
}
