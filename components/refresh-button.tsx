"use client"

import { useRouter } from "next/navigation"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const RefreshButton = () => {
    const router = useRouter()

    const handleRefresh = async () => {
        await router.refresh()
    }

    return (
        <Button onClick={handleRefresh} variant={"outline"}>
            <RefreshCwIcon className="h-4 w-4" />
        </Button>
    )
}
