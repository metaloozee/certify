"use client"

import { useState } from "react"

import { EventData } from "@/components/event-card"
import { CanvasImage } from "@/components/template-canvas"

export const TemplateConfigForm = ({
    cords,
    setCords,
    setTemplateFile,
    event,
    templateFontSize,
    setTemplateFontSize,
}: {
    cords: number[][]
    setCords: any
    setTemplateFile: any
    event: EventData
    templateFontSize: number
    setTemplateFontSize: any
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
                    setTemplateFile={setTemplateFile}
                    event={event}
                    templateFontSize={templateFontSize}
                    setTemplateFontSize={setTemplateFontSize}
                />
            </div>
        </div>
    )
}
