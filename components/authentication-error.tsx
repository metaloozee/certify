import { Alert } from "@/components/ui/alert"

export const AuthError = () => {
    return (
        <div className="flex justify-center items-center">
            <Alert variant={"destructive"} className="text-red-600">
                <h1 className=" text-red-500">Authentication Error!</h1> Try
                logging in again...
            </Alert>
        </div>
    )
}
