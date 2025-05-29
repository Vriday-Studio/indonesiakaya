import React, { useEffect } from "react";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import { sanitizeDOM } from "../lib/sanitizeDOM";
import { useAuth } from "../context/AuthProvider";
import { updateTermsUser } from "../lib/firebase/users";
import LoadingScreen from "../components/LoadingScreen";

const PrivacyPolicy = ({ isModal }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);

    const { user, loginUser, logoutUser } = useAuth();

    useEffect(() => {
        const fetchContent = async () => {
            const contents = await getContentSettingByTag("content");
            const contentByTag = contents.find((item) => item.tag === "privacy-policy");
            setSelectedContent(contentByTag);
            setIsLoading(false);
        };
        fetchContent();
    }, []);

    const handleAgree = async () => {
        await updateTermsUser(user.id);
        loginUser({
            user: { ...user, terms: true },
        });
    }

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div className="bg-primary-dark text-primary-orange p-10">
            <h1 className="text-center text-xl">{selectedContent.title}</h1>
            <div
                className="border-t border-primary-orange py-7 mt-5 text-sm unreset"
                dangerouslySetInnerHTML={{ __html: sanitizeDOM(selectedContent.description) }}
            ></div>
            {isModal || (user && !user.terms) && (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button onClick={logoutUser} className="w-full bg-slate-300 text-primary-dark py-2 rounded-md">
                            Batal
                        </button>
                        <button
                            className={`bg-primary-orange w-full text-primary-dark py-2 rounded-md`}
                            onClick={handleAgree}
                        >
                            Setuju
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacyPolicy;
