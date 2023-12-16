import { ChangeEvent, useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { EventData } from "@/components/event-card"

export const CanvasImage = ({
    template,
    setTemplate,
    cords,
    setCords,
    setTemplateFile,
    event,
    templateFontSize,
    setTemplateFontSize,
}: {
    template: HTMLImageElement | null
    setTemplate: any
    cords: number[][]
    setCords: any
    setTemplateFile: any
    event: EventData
    templateFontSize: number
    setTemplateFontSize: any
}) => {
    useEffect(() => {
        const Canvas: any = document.getElementById("canvas")
        if (template) {
            drawImageOnCanvas(Canvas)
            fillText(Canvas)
        } else {
            const ctx = Canvas.getContext("2d")
            ctx.font = "20px Arial"

            ctx.fillStyle = "#ffffff"
            ctx.fillText(
                "Please Upload A Template",
                Canvas.width / 3,
                Canvas.height / 2
            )
        }
    }, [template])

    const [status, setStatus] = useState(0)

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const file = files[0]
            if (file) {
                setTemplateFile(file)
                const url = URL.createObjectURL(file)

                const image = new Image()
                image.src = url
                image.onload = () => {
                    setTemplate(image)
                }
            }
        }
    }

    const drawImageOnCanvas = (canvas: HTMLCanvasElement) => {
        if (canvas) {
            const ctx = canvas.getContext("2d")

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                if (template) {
                    ctx.drawImage(template, 0, 0)
                }
            }
        }

        return canvas
    }

    const changeState = (index: number, x: number, y: number) => {
        let temp = [...cords]
        temp[index][0] = x
        temp[index][1] = y
        setCords(temp)
    }

    const fillText = (canvas: HTMLCanvasElement) => {
        const ctx = canvas?.getContext("2d")
        if (ctx) {
            ctx.fillStyle = "#000000"
            ctx.font = `"${templateFontSize}px Arial`
            ctx.fillText("Your name here", cords[0][0], cords[0][1])
            ctx.fillText("TYIF", cords[1][0], cords[1][1])
            ctx.fillText(event.date ?? "2005/04/18", cords[2][0], cords[2][1])
            ctx.fillText(event.name ?? "Event Name", cords[3][0], cords[3][1])
            ctx.fillText("First Runner Up", cords[4][0], cords[4][1])
        }
    }

    const handleClick = (e: any) => {
        const canvas: any = document.getElementById("canvas")
        if (canvas && template) {
            const ctx = canvas.getContext("2d")

            if (ctx) {
                ctx.font = `${templateFontSize}px Arial`

                const rect = canvas.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                changeState(status, x, y)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                drawImageOnCanvas(canvas)
                fillText(canvas)
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
            <div>
                <RadioGroup className="flex mt-5 mb-5" defaultValue="name">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            onClick={() => setStatus(0)}
                            value="name"
                            id="name"
                        />
                        <Label htmlFor="name">Name</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            onClick={() => setStatus(1)}
                            value="class"
                            id="class"
                        />
                        <Label htmlFor="class">Class</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            onClick={() => setStatus(2)}
                            value="date"
                            id="date"
                        />
                        <Label htmlFor="date">Date</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            onClick={() => setStatus(3)}
                            value="event"
                            id="event"
                        />
                        <Label htmlFor="event">Event Name</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            onClick={() => setStatus(4)}
                            value="postion"
                            id="postion"
                        />
                        <Label htmlFor="position">Position</Label>
                    </div>
                </RadioGroup>
                <Label className="text-lg" htmlFor="slider">
                    Font Size: {templateFontSize}
                </Label>
                <Slider
                    onValueChange={(e) => setTemplateFontSize(e[0])}
                    defaultValue={[20]}
                    max={100}
                    min={10}
                    step={1}
                    id="slider"
                    className="mt-2 max-w-md"
                />

                <canvas
                    style={{ border: "1px solid white" }}
                    className="my-10 rounded-lg"
                    id="canvas"
                    width={template ? template.width : "1280"}
                    height={template ? template.height : "720"}
                    onClick={(e) => handleClick(e)}
                ></canvas>
            </div>
        </div>
    )
}
