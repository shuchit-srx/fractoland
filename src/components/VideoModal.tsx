import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black/90 border-white/10">
                <div className="aspect-video w-full relative">
                    <video
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        src="/videos/tutorial.mp4"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VideoModal;
