import logo from "@/assets/coinc-loco.png";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="mx-auto mb-4 flex h-40  items-center justify-center">
                <img
                    src={logo.src}
                    alt="Coinc Logo"
                    className="h-full w-full"
                />
            </div>
        </div>
    );
}
