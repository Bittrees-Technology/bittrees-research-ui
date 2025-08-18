import {CodeOfEthicsContent} from "@/content/CodeOfEthicsContent";
import {useSetLayoutData} from "@/hooks/useSetLayoutData.tsx";

function CodeOfEthicsPage() {
    useSetLayoutData({
        title: "Code of Ethics",
        showBackButton: true,
        backButtonText: 'Member Services',
        backButtonTo: '/members'
    });

    return (
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
            <div className="mt-4">
                <CodeOfEthicsContent/>
            </div>
        </div>
    );
}

export default CodeOfEthicsPage;
