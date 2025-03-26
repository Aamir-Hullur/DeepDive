'use client'
import { useDeepResearchStore } from '@/store/deepResearch'
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

  
const ResearchActivities = () => {

    const {activities, sources, isLoading} = useDeepResearchStore()
  return (
    <div className='w-[400px] fixed top-4 right-4' >
<Collapsible className='w-full'>
  <CollapsibleTrigger asChild>
    <Button variant={'outline'} size="sm" className='w-9 p-0' >
        <ChevronDown className='w-4 h-4' />
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent className='h-[50vh]'>
  <Tabs defaultValue="activities" className="w-full h-full shadow-md">
  <TabsList className='w-full px-2 py-6'>
    <TabsTrigger value="activities" className='flex-1 h-auto shadow-none border-black/10 border-solid'>Activities</TabsTrigger>
    {
        sources.length > 0 && <TabsTrigger value="sources">Sources</TabsTrigger>
    }
  </TabsList>
  <TabsContent value="activities" className='h-[calc(100%-60px)] overflow-y-auto border-black/10 border-solid'>
    <ul className='space-y-4 p-4'>
        {
            activities.map((activity,index) => <li key={index} className='flex flex-col gap-2 border-b-2 p-2 text-sm'>
                <div className='flex items-center gap-2'>
                    <span className={`
                        ${activity.status === 'complete'? "bg-green-500":
                            activity.status === 'error'? "bg-red-500": "bg-yellow-500"
                        } min-w-2 min-h-2 block rounded-full
                        `}>
                        &nbsp;
                    </span>

                    <p>
                    {
                        activity.message.includes("https://") ? activity.message.split("https://")[0]+
                        activity.message.split("https://")[1].split("/")[0] : activity.message
                    }
                    </p>
                </div>
                <span>
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}
                </span>
            </li>)
        }
    </ul>
  </TabsContent>
  <TabsContent value="sources">Change your password here.</TabsContent>
</Tabs>

  </CollapsibleContent>
</Collapsible>

    </div>
  )
}

export default ResearchActivities