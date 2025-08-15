import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
export default function AlertModel({isOpen , setisOpen , alertContent, onclick}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setisOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
                    <AlertDialogDescription>{alertContent.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button onClick={onclick}>OK</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}