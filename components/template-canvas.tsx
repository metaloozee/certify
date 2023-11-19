import { ChangeEvent, useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const CanvasImage = ({
    template,
    setTemplate,
    cords,
    setCords,
    setTemplateFile,
}: {
    template: HTMLImageElement | null
    setTemplate: any
    cords: number[][]
    setCords: any
    setTemplateFile: any
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
            ctx.font = "30px Arial"
            ctx.fillText("Your name here", cords[0][0], cords[0][1])
            ctx.fillText("TYIF", cords[1][0], cords[1][1])
            ctx.fillText("10/10/2023", cords[2][0], cords[2][1])
            ctx.fillText("Model Making", cords[3][0], cords[3][1])
            ctx.fillText("First Runner Up", cords[4][0], cords[4][1])
        }
    }

    const handleClick = (e: any) => {
        const canvas: any = document.getElementById("canvas")
        if (canvas) {
            const ctx = canvas.getContext("2d")

            if (ctx) {
                ctx.font = "25px Arial"

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
        <div>
            <Input
                onChange={(event) => handleFile(event)}
                type="file"
                id="template"
            />
            <div>
                <RadioGroup className="flex mt-5" defaultValue="name">
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

                <canvas
                    style={{ border: "1px solid white" }}
                    className="my-10"
                    id="canvas"
                    width={template ? template.width : "720"}
                    height={template ? template.height : "480"}
                    onClick={(e) => handleClick(e)}
                ></canvas>
            </div>
        </div>
    )
}
