"use client"

import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Trophy,
  Clock,
  MapPin,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Navigation data
const navigationData = {
  main: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    // { title: "Academics", url: "/academics", icon: BookOpen },
    // { title: "Students", url: "/students", icon: Users },
    // { title: "Calendar", url: "/calendar", icon: Calendar },
  ],
  // academic: [
  //   { title: "Courses", url: "/courses", icon: GraduationCap },
  //   { title: "Assignments", url: "/assignments", icon: FileText },
  //   { title: "Grades", url: "/grades", icon: Trophy },
  //   { title: "Schedule", url: "/schedule", icon: Clock },
  // ],
  communication: [
    { title: "Report 1", url: "/messages", icon: MessageSquare },
    { title: "Report 2", url: "/announcements", icon: FileText },
  ],
  // facilities: [
  //   { title: "Campus Map", url: "/campus", icon: MapPin },
  //   { title: "Settings", url: "/settings", icon: Settings },
  // ],
}

export function SchoolSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2  py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px] p-1">TWC</span>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm">Third Wave Coffee</span>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-2 my-2" />

        
        {/* Communication */}
        <SidebarGroup>
          <SidebarGroupLabel>Report</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.communication.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-2 my-2" />

        {/* Facilities */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Facilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.facilities.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      

      <SidebarRail />
    </Sidebar>
  )
}
