"use client"

import { useState } from "react"

import { CanvasImage } from "@/components/template-canvas"

export const TemplateConfigForm = ({
    cords,
    setCords,
    setTemplateFile,
}: {
    cords: number[][]
    setCords: any
    setTemplateFile: any
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
                />
            </div>
        </div>
    )
}
