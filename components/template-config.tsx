"use client"

import { ChangeEvent, useState } from "react"

import type { EventData } from "@/components/event-card"
import { CanvasImage } from "@/components/template-canvas"

import { Input } from "./ui/input"

export const TemplateConfigForm = ({ event }: { event: EventData }) => {
    const [template, setTemplate] = useState<HTMLImageElement | null>(null)

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const file = files[0]
            if (file) {
                console.log("fileeee")

                const url = URL.createObjectURL(file)

                const image = new Image()
                image.src = url
                image.onload = () => {
                    console.log("ejhkehjf")

                    setTemplate(image)
                }
            }
        }
    }

    return (
        <div className="w-full">
            <Input
                onChange={(event) => handleFile(event)}
                type="file"
                id="template"
            />
            <div className="w-full flex items-center justify-center">
                {template && <CanvasImage image={template}></CanvasImage>}
            </div>
        </div>
    )
}
