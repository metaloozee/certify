"use client"

import { ChangeEvent, useState } from "react"

import type { EventData } from "@/components/event-card"
import { CanvasImage } from "@/components/template-canvas"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export const TemplateConfigForm = ({
    winnerCords,
    firstRunnerCords,
    secondRunnerCords,
    participantCords,
    setWinnerCords,
    setFirstRunnerCords,
    setSecondRunnerCords,
    setParticipantCords,
}: {
    winnerCords: number[][]
    firstRunnerCords: number[][]
    secondRunnerCords: number[][]
    participantCords: number[][]
    setWinnerCords: any
    setFirstRunnerCords: any
    setSecondRunnerCords: any
    setParticipantCords: any
}) => {
    const [winnerTemplate, setWinnerTemplate] =
        useState<HTMLImageElement | null>(null)
    const [runner1Template, setrunner1Template] =
        useState<HTMLImageElement | null>(null)
    const [runner2Template, setrunner2Template] =
        useState<HTMLImageElement | null>(null)
    const [participantTemplate, setParticipantTemplate] =
        useState<HTMLImageElement | null>(null)

    return (
        <div className="w-full">
            <Tabs defaultValue="winner-config" className="w-full">
                <TabsList>
                    <TabsTrigger value="winner-config">Winner</TabsTrigger>
                    <TabsTrigger value="firstrunner-config">
                        First Runner Up
                    </TabsTrigger>
                    <TabsTrigger value="secondrunner-config">
                        Second Runner Up
                    </TabsTrigger>
                    <TabsTrigger value="participant-config">
                        Participant
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="winner-config">
                    <div className="w-full flex items-center justify-center">
                        <CanvasImage
                            template={winnerTemplate}
                            setTemplate={setWinnerTemplate}
                            cords={winnerCords}
                            setCords={setWinnerCords}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="firstrunner-config">
                    <div className="w-full flex items-center justify-center">
                        <CanvasImage
                            template={runner1Template}
                            setTemplate={setrunner1Template}
                            cords={firstRunnerCords}
                            setCords={setFirstRunnerCords}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="secondrunner-config">
                    <div className="w-full flex items-center justify-center">
                        <CanvasImage
                            template={runner2Template}
                            setTemplate={setrunner2Template}
                            cords={secondRunnerCords}
                            setCords={setSecondRunnerCords}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="participant-config">
                    <div className="w-full flex items-center justify-center">
                        <CanvasImage
                            template={participantTemplate}
                            setTemplate={setParticipantTemplate}
                            cords={participantCords}
                            setCords={setParticipantCords}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
