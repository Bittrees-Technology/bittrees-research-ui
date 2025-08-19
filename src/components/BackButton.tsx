import {Link} from "react-router";
import BackArrow from "@/components/BackArrow.tsx";

interface BackButtonProps {
    to?: string;
    text?: string;
}

function BackButton({to = "/", text = "Back"}: BackButtonProps) {
    return (
        <Link to={to} className="hover:text-green-700">
            <BackArrow/>
            <span className="inline-block align-middle underline font-bold font-newtimesroman">
        {text}
      </span>
        </Link>
    );
}

export default BackButton;