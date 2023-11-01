"use client"

import { ChangeEvent, useState } from "react"

import type { EventData } from "@/components/event-card"
import { CanvasImage } from "@/components/template-canvas"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export const TemplateConfigForm = ({
    cords,
    setCords,
}: {
    cords: number[][]
    setCords: any
}) => {
    const [template, setTemplate] = useState<HTMLImageElement | null>(null)

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center">
                <CanvasImage
                    template={template}
                    setTemplate={setTemplate}
                    cords={cords}
                    setCords={setCords}
                />
            </div>
        </div>
    )
}
