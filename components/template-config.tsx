"use client"

import { ChangeEvent, useState } from "react"

import type { EventData } from "@/components/event-card"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const TemplateConfigForm = ({ event }: { event: EventData }) => {
    const [fileName, setFileName] = useState<FileList | null>(null)
    const [template, setTemplate] = useState<File | null>(null)

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            setTemplate(files[0])
        }
    }

    return (
        <div>
            <Label htmlFor="template">{fileName}</Label>
            <Input
                onChange={(event) => handleFile(event)}
                type="file"
                id="template"
            />
        </div>
    )
}
