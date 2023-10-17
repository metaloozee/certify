import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Button } from "./ui/button"

export const CanvasImage = ({ image }: { image: HTMLImageElement }) => {
    const [nameCords, setNameCords] = useState<number[]>([-1, -1])
    const [classCords, setClassCords] = useState<number[]>([-1, -1])
    const [dateCords, setDateCords] = useState<number[]>([-1, -1])
    const [eventCords, setEventCords] = useState<number[]>([-1, -1])

    const [status, setStatus] = useState(0)

    const drawImageOnCanvas = () => {
        const element: any = document.getElementById("canvas")
        const canvas: HTMLCanvasElement = element

        if (canvas) {
            const ctx = canvas.getContext("2d")

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                ctx.drawImage(image, 0, 0)
            }
        }

        return canvas
    }

    const handleClick = (e: any) => {
        const canvas = drawImageOnCanvas()
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.font = "30px Arial"

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            switch (status) {
                case 0:
                    setNameCords([x, y])
                    break

                case 1:
                    setClassCords([x, y])
                    break

                case 2:
                    setDateCords([x, y])
                    break

                case 3:
                    setEventCords([x, y])
                    break
            }

            ctx.fillText("Your name here", nameCords[0], nameCords[1])
            ctx.fillText("10/10/2023", dateCords[0], dateCords[1])
            ctx.fillText("Model Making", eventCords[0], eventCords[1])
            ctx.fillText("TYIF", classCords[0], classCords[1])
        }
    }

    useEffect(() => {
        drawImageOnCanvas()
    }, [])

    return (
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
            </RadioGroup>

            <canvas
                className="my-10"
                id="canvas"
                width={image.width}
                height={image.height}
                onClick={(e) => handleClick(e)}
            ></canvas>
            <Button onClick={() => setStatus(status + 1)}>Next</Button>
        </div>
    )
}
