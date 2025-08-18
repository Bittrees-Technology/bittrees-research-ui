import {VisionStatementContent} from "@/content/VisionStatementContent";
import {useSetLayoutData} from "@/hooks/useSetLayoutData.tsx";

function VisionStatementPage() {
    useSetLayoutData({
        title: 'Vision Statement',
        showBackButton: true,
        backButtonText: 'Member Services',
        backButtonTo: '/members'
    });

    return (
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
            <div className="mt-4">
                <VisionStatementContent/>
            </div>
        </div>
    );
}

export default VisionStatementPage;
