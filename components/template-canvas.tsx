import { useEffect, useState } from "react"

import { Button } from "./ui/button"

export const CanvasImage = ({ image }: { image: HTMLImageElement }) => {
    const [nameCords, setNameCords] = useState<object | null>(null)
    const [nameConfirmed, setNameConfirmed] = useState(false)
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
            if (!nameConfirmed) {
                setNameCords({ x: x, y: y })
                ctx.fillText("Your name here", x, y)
            } else {
                ctx.fillText("Your name here", nameCords["x"], ["y"])
            }
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
            <Button onClick={() => setNameConfirmed(true)}>Next</Button>
        </div>
    )
}
