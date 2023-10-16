import { useEffect, useState } from "react"

import { Button } from "./ui/button"

export const CanvasImage = ({ image }: { image: HTMLImageElement }) => {
    const [nameCords, setNameCords] = useState<number[]>([-1, -1])
    const [classCords, setClassCords] = useState<number[]>([-1, -1])
    const [dateCords, setDateCords] = useState<number[]>([-1, -1])
    const [eventCords, setEventCords] = useState<number[]>([-1, -1])

    const [classConfirmed, setClassConfirmed] = useState(false)
    const [dateConfirmed, setdateConfirmed] = useState(false)
    const [eventConfirmed, setEventConfirmed] = useState(false)
    const [nameConfirmed, setNameConfirmed] = useState(false)

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
