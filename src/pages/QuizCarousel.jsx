import React, { useState, useRef, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import BackIcon from "../components/BackIcon";
import bgAuth from "/images/bg-auth.png";
import { addSolvedQuiz, getQuizByArtworkId, getUserQuizAttempt } from "../lib/firebase/quiz";
import { useAuth } from "../context/AuthProvider";
import correctImage from "/images/correct.png";
import incorrectImage from "/images/incorrect.png";
import DetailImage from "./DetailImage";

const QuizPagination = ({ answersStatus }) => {
    return (
        <div className="flex justify-center gap-2">
            {answersStatus.map((status, index) => (
                <div
                    key={index}
                    className={`w-8 h-8 rounded-sm flex justify-center items-center ${
                        status === true ? "bg-correct" : status === false ? "bg-wrong" : "bg-not-answered"
                    }`}
                >
                    <svg viewBox="0 0 133 192" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                        <g clipPath="url(#clip0_1095_119231)">
                            <path
                                d="M109.326 19.4124C97.8311 7.8705 81.897 0.717041 64.3442 0.717041C64.0154 0.717041 63.6866 0.717041 63.3705 0.717041C46.3362 0.97071 30.8447 8.07344 19.5517 19.3363C8.24611 30.6119 1.08842 46.1111 0.734326 63.183C0.72168 63.6269 0.72168 64.0835 0.72168 64.5275C0.72168 77.008 4.30053 88.6767 10.4971 98.5064C16.6811 108.336 25.4701 116.352 35.8905 121.59C36.6745 121.971 37.1677 122.808 37.1551 123.582V123.823C37.0666 124.457 37.0286 125.104 37.0286 125.75V131.407C36.8642 132.32 36.7631 133.259 36.7631 134.236V151.282C36.7631 155.836 38.622 159.983 41.5939 162.951C42.1503 163.509 42.77 164.016 43.4023 164.498V165.691C43.4023 169.382 44.9072 172.743 47.3226 175.152C49.7253 177.562 53.0765 179.084 56.7566 179.084H73.3609C77.0409 179.084 80.3921 177.562 82.7949 175.152C85.1976 172.743 86.7152 169.382 86.7152 165.691V164.498C87.3475 164.016 87.9671 163.522 88.5236 162.951C91.4954 159.97 93.3544 155.823 93.3544 151.282V134.236C93.3544 133.601 93.3038 132.993 93.2406 132.397V125.75C93.2406 124.71 93.1394 123.683 92.9497 122.694L92.9244 122.453C92.9244 122.212 92.9876 121.958 93.152 121.692C93.3164 121.438 93.5694 121.184 93.8855 121.02C104.015 115.68 112.526 107.702 118.507 97.9737C124.489 88.2582 127.954 76.7797 127.954 64.5148C127.954 46.9101 120.822 30.929 109.326 19.3998V19.4124ZM76.3074 167.2C75.5234 168.9 74.5117 169.902 73.3609 169.902H56.7566C55.6058 169.902 54.5941 168.9 53.81 167.2C53.5571 166.642 53.3547 166.008 53.1777 165.348C53.203 165.348 53.2156 165.348 53.2409 165.348H76.8891C76.8891 165.348 76.9271 165.348 76.9524 165.348C76.7753 166.008 76.573 166.642 76.3201 167.2H76.3074ZM82.7949 148.758C82.7949 151.143 82.0488 153.286 80.7968 154.884C79.5448 156.482 77.8755 157.434 76.0166 157.434H54.1009C52.2419 157.434 50.5726 156.47 49.3206 154.884C48.0813 153.286 47.3352 151.143 47.3226 148.758V139.334C48.0687 139.55 48.8401 139.677 49.6368 139.677H80.6197C81.3659 139.677 82.0867 139.563 82.7949 139.372V148.758ZM110.098 93.2047C105.027 101.449 97.8311 108.171 89.295 112.674C87.9545 113.384 86.829 114.424 86.0323 115.692C85.2229 116.986 84.793 118.47 84.793 119.967C84.793 120.461 84.8435 120.969 84.9321 121.451C85.0332 121.996 85.0838 122.542 85.0838 123.087V130.989C85.0838 132.092 84.6665 133.094 83.8824 133.893C83.0604 134.705 82.0614 135.124 80.9738 135.124H49.2195C48.1193 135.124 47.1202 134.705 46.3235 133.919C45.5142 133.094 45.0968 132.092 45.0968 130.989V123.074C45.0968 122.719 45.1221 122.389 45.1601 122.047C45.198 121.704 45.2233 121.362 45.2233 121.007C45.2233 117.658 43.339 114.64 40.3293 113.118C31.5402 108.704 24.1296 101.956 18.8688 93.6106C13.4816 85.0366 10.6236 75.1181 10.6236 64.9206C10.6236 64.5401 10.6236 64.1596 10.6236 63.7918C10.9144 49.8654 16.5546 36.7127 26.5071 26.7815C36.4722 16.8504 49.6115 11.2697 63.4969 11.054H64.3316C78.6722 11.054 92.1656 16.6601 102.32 26.8323C112.463 37.0171 118.052 50.5503 118.052 64.9333C118.052 74.9406 115.295 84.7068 110.085 93.1794L110.098 93.2047Z"
                                fill="white"
                            />
                            <path
                                d="M99.7281 29.407C90.2688 19.9325 77.6986 14.7069 64.3443 14.7069H63.5603C50.636 14.9098 38.4072 20.1101 29.1123 29.369C19.8301 38.6279 14.5693 50.8674 14.3037 63.8426C14.3037 64.1977 14.3037 64.5529 14.3037 64.908C14.3037 74.3952 16.9594 83.6414 21.9799 91.632C26.8739 99.407 33.7914 105.698 41.9734 109.807C46.3869 112.027 49.1311 116.466 49.1437 121.375C49.1437 121.882 49.1184 122.402 49.0552 122.909C49.0299 123.1 49.0173 123.277 49.0173 123.467V131.42L49.1058 131.521H81.0878L83.225 131.42H81.2016V123.455C81.2016 123.163 81.1763 122.859 81.1131 122.567C80.974 121.831 80.8981 121.058 80.8981 120.297C80.8981 118.014 81.543 115.781 82.7697 113.828C83.9458 111.938 85.6151 110.391 87.6005 109.351C95.5549 105.153 102.257 98.8869 106.987 91.2008C111.843 83.3117 114.41 74.2176 114.41 64.8953C114.41 51.4889 109.2 38.8816 99.7534 29.407H99.7281ZM70.5662 97.8849C70.1995 98.7982 69.6178 99.6099 68.8843 100.269C67.4679 101.55 65.7228 102.223 63.8385 102.21C61.9036 102.21 60.1332 101.563 58.6915 100.295C57.9328 99.6353 57.351 98.8362 56.9843 97.9103C56.6049 96.9844 56.4279 95.9697 56.4279 94.8536C56.4279 92.8496 57.1613 91.0232 58.5904 89.6534C59.9941 88.2582 61.8278 87.5353 63.8385 87.5479C65.8366 87.5479 67.645 88.2709 69.0107 89.6661C70.4018 91.0486 71.1226 92.8623 71.1226 94.8536C71.1226 95.9444 70.9456 96.9591 70.5789 97.8723L70.5662 97.8849ZM84.7678 58.4902C83.7561 60.3673 82.5547 62.0035 81.1384 63.386C79.7852 64.7177 77.3951 66.912 73.9554 70.0067C73.0322 70.8565 72.2987 71.5922 71.755 72.2136C71.2238 72.8351 70.8444 73.3678 70.6168 73.8118C70.3639 74.3064 70.1742 74.7884 70.0477 75.2577C69.9086 75.765 69.6683 76.7163 69.3648 78.0861C69.074 79.6715 68.4417 81.0033 67.3921 81.9165C66.3424 82.8424 64.9387 83.2736 63.3706 83.2609C61.6887 83.2609 60.1585 82.6775 58.9824 81.5487C58.3627 80.9525 57.8948 80.2042 57.604 79.3671C57.3131 78.5173 57.174 77.5788 57.174 76.5514C57.174 74.0908 57.5534 71.9093 58.3501 70.0321C59.1215 68.2057 60.1458 66.5822 61.4357 65.187C62.675 63.8426 64.319 62.2698 66.3804 60.4561C68.1635 58.896 69.4407 57.7165 70.2121 56.9555C70.9456 56.2198 71.5526 55.4081 72.0585 54.5076C72.5137 53.6705 72.7413 52.7953 72.7413 51.8187C72.7413 49.8401 72.0458 48.28 70.5789 46.8975C69.1119 45.553 67.2782 44.8681 64.8375 44.8555C63.3832 44.8555 62.1566 45.0457 61.1702 45.3882C60.1711 45.7306 59.3997 46.2253 58.8053 46.8721C57.5028 48.2673 56.3141 50.4362 55.3403 53.3661C54.8218 55.0656 54.0631 56.4228 52.9755 57.3867C51.8879 58.3506 50.4842 58.8453 48.954 58.8326C47.1456 58.8326 45.489 58.1604 44.2497 56.854C43.0357 55.611 42.3401 54.1271 42.3401 52.5289C42.3401 49.6371 43.2759 46.7453 45.059 43.8788C46.8674 40.9743 49.5105 38.5898 52.9123 36.7254C56.352 34.8355 60.3608 33.9096 64.8628 33.9096C69.0487 33.9096 72.7919 34.6833 76.0546 36.2688C79.3047 37.8415 81.8592 40.0104 83.6676 42.75C85.4633 45.4896 86.3738 48.5083 86.3738 51.7299C86.3738 54.2539 85.8554 56.5242 84.8057 58.4902H84.7678Z"
                                fill="white"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1095_119231">
                                <rect width="132" height="191" fill="white" transform="translate(0.72168 0.717041)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            ))}
        </div>
    );
};

const QuizSlides = ({
    title,
    quizIndex,
    question,
    lastQuestion,
    setUserPoint,
    answersStatus, // terima prop ini dari parent
    setAnswersStatus, // jika perlu update
    setCurrentCorrectAnswer,
}) => {
    const handleAnswer = (answer) => {
        const correct = answer === question.correctAnswer;
        setCurrentCorrectAnswer(question.correctAnswer);
        setUserPoint((point) => (correct ? point + Number(question.point) : point));
        setAnswersStatus((status) => {
            const newStatus = [...status];
            newStatus[quizIndex] = correct; // update sesuai dengan quizIndex
            return newStatus;
        });

        if (lastQuestion) {
            correct ? document.getElementById("modal_correct_last_answer").showModal() : document.getElementById("modal_incorrect_last_answer").showModal();
        } else {
            correct ? document.getElementById("modal_correct_answer").showModal() : document.getElementById("modal_incorrect_answer").showModal();
        }
    };

    return (
        <div className="min-h-screen flex-shrink-0 bg-white w-full overflow-auto">
            <div className="relative flex flex-col justify-start items-center gap-1 px-12 pt-6 w-full bg-primary-orange h-2/5">
                <h1 className="text-xl font-bold text-white px-5 text-center">{title}</h1>
                <div className="bg-cream text-primary-brass rounded-2xl py-1 px-10 mt-2">{question.point}</div>
                <img src={bgAuth} alt="bg-auth" className="absolute w-full h-3/5 p-2" />
            </div>
            <div className="relative bg-white border border-white rounded-t-full -mt-10 py-6 z-20">
                <div className="flex flex-col justify-center items-center gap-5 absolute pb-10 -top-20 w-full px-10 text-center text-sm">
                    {question.image && <img src={question.image} alt="quiz" className="w-72 h-72 object-cover object-top" />}

                    {/* Pagination Indicator */}
                    <QuizPagination answersStatus={answersStatus} />

                    <p>{question.question}</p>
                    <div className="flex flex-col gap-2 w-full">
                        {question.options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswer(option)} className="bg-gray-black text-primary-brass py-4 px-2 w-full rounded-lg">
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal List */}
        </div>
    );
};

const QuizCarousel = () => {
    const [curr, setCurr] = useState(0);
    const [dataQuiz, setDataQuiz] = useState(null);
    const [totalPoint, setTotalPoint] = useState(0);
    const [questionLength, setQuestionLength] = useState(0);
    const [userPoint, setUserPoint] = useState(0);
    const [answersStatus, setAnswersStatus] = useState(Array(questionLength).fill(null));
    const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState("");
    const [userAttempt, setUserAttempt] = useState(0);

    const carouselRef = useRef(null);
    const { user } = useAuth();
    const next = () => setCurr((curr) => (curr === questionLength - 1 ? 0 : curr + 1));
    const navigate = useNavigate();
    const { id } = useParams();

    const handleLastAnswer = async () => {
        await addSolvedQuiz(user, dataQuiz.id, userPoint);
        document.getElementById("modal_total_point").showModal();
    };

    const DIALOG_LIST = [
        {
            id: "modal_correct_last_answer",
            title: "Benar",
            icon: correctImage,
            btnTitle: "Lanjut",
            onClickButton: handleLastAnswer,
        },
        {
            id: "modal_correct_answer",
            title: "Benar",
            icon: correctImage,
            btnTitle: "Lanjut",
            onClickButton: next,
        },
        {
            id: "modal_incorrect_last_answer",
            title: "Salah",
            icon: incorrectImage,
            btnTitle: "Lanjut",
            onClickButton: handleLastAnswer,
        },
        {
            id: "modal_incorrect_answer",
            title: "Salah",
            icon: incorrectImage,
            btnTitle: "Lanjut",
            onClickButton: next,
        },
        {
            id: "modal_total_point",
        },
    ];

    const getSelectedQuiz = async () => {
        try {
            const quiz = await getQuizByArtworkId(id);
            setDataQuiz(quiz);
            setTotalPoint(quiz.totalPoint);
            const attempt = await getUserQuizAttempt(user.id, quiz.id);
            setUserAttempt(attempt);

            setQuestionLength(quiz.questions.length);
            setAnswersStatus(Array(quiz.questions.length).fill(null)); // Reset status
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getSelectedQuiz();
    }, []);

    const selectedStyleBasedOnAnimationType = {
        slide: {
            display: "flex",
            transition: "transform 0.5s ease-out",
            transform: `translateX(-${curr * 100}%)`,
        },
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (userAttempt >= 2) {
        return <Navigate to="/" />;
    }

    return (
        <div ref={carouselRef} className="overflow-hidden relative">
            <BackIcon iconColor="white" className="absolute left-2 top-5 z-10" />
            <button onClick={() => document.getElementById("detailImage").showModal()} className="absolute top-6 right-3 z-10 bg-white opacity-60 rounded-full p-2">
                <svg width="15" height="15" viewBox="0 0 10 23" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.87402 10.4642L3.87832 10.4631L3.92963 10.3103C4.07279 9.88409 4.14539 9.50422 4.084 9.21155C4.05114 9.05489 3.97622 8.90654 3.83895 8.80105C3.70398 8.69731 3.54224 8.66084 3.38378 8.66084C2.98501 8.66084 2.64499 8.87146 2.36318 9.20312L2.3627 9.20369C2.32418 9.24926 2.28565 9.29878 2.2471 9.35217C2.5115 8.92425 2.82045 8.60628 3.16938 8.3879C3.78933 7.9999 4.49371 7.80422 5.28824 7.80422C6.09809 7.80422 6.64635 7.9974 6.95488 8.31603C7.29199 8.6642 7.48175 9.09049 7.52128 9.60937L7.52128 9.60943C7.56261 10.1506 7.49233 10.6955 7.31011 11.2434L7.30999 11.2438L4.52943 19.6394L4.52931 19.6394L4.52686 19.6476C4.4526 19.8954 4.40398 20.1165 4.38605 20.307C4.36862 20.4923 4.37716 20.678 4.44546 20.8357C4.50524 20.9738 4.59823 21.0928 4.7297 21.1747C4.8597 21.2557 5.00662 21.2877 5.15466 21.2877C5.46213 21.2877 5.76252 21.1058 6.0411 20.8557C6.12012 20.7847 6.19624 20.6977 6.26999 20.5969C5.97993 21.083 5.64584 21.4175 5.27591 21.618L5.27568 21.6182C4.62527 21.9716 3.98422 22.1428 3.35218 22.1428C2.61658 22.1428 2.08039 21.9784 1.70853 21.6869C1.34378 21.401 1.11621 20.9703 1.05233 20.3591C0.987905 19.7412 1.09936 18.9566 1.40994 17.9927C1.41001 17.9925 1.41009 17.9922 1.41017 17.992L3.87402 10.4642ZM5.42886 4.56161C5.15879 4.32918 5.0099 4.01184 5.00139 3.57573L5.00354 3.4665C5.0194 2.6612 5.28716 2.08778 5.77895 1.69664C6.29377 1.28754 6.92038 1.07731 7.6724 1.07731C8.35875 1.07731 8.81843 1.22999 9.10472 1.48225C9.38438 1.72868 9.53647 2.09384 9.5198 2.63117L9.51974 2.63368C9.50438 3.31586 9.24537 3.86483 8.73579 4.30165C8.22039 4.74345 7.59007 4.96883 6.82358 4.96883C6.1776 4.96883 5.72726 4.81963 5.42938 4.56206L5.42886 4.56161Z"
                        fill="black"
                        stroke="black"
                        strokeWidth="0.594077"
                    />
                </svg>
            </button>
            {dataQuiz && (
                <div style={selectedStyleBasedOnAnimationType["slide"]}>
                    {dataQuiz.questions.map((question, index) => (
                        <QuizSlides
                            key={index}
                            quizIndex={index}
                            title={dataQuiz.title}
                            question={question}
                            next={next}
                            lastQuestion={index === questionLength - 1}
                            answersStatus={answersStatus}
                            setUserPoint={setUserPoint}
                            setAnswersStatus={setAnswersStatus}
                            setCurrentCorrectAnswer={setCurrentCorrectAnswer}
                        />
                    ))}
                </div>
            )}
            {DIALOG_LIST.map((dialog) => (
                <dialog key={dialog.id} id={dialog.id} className="modal bg-black/80">
                    {dialog.id === "modal_total_point" ? (
                        <div className="flex flex-col gap-8 justify-center items-center text-white text-xl px-10">
                            <p>Kamu mendapatkan</p>
                            <QuizPagination answersStatus={answersStatus} />
                            <div className="bg-cream text-primary-brass rounded-2xl pt-0 px-10 pb-2 font-bold text-2xl">{userPoint}</div>
                            <p>point</p>
                            <p className="text-sm text-center">
                                Jelajahi karya dan jawab dengan benar pertanyaan dalam mini kuis pada karya lainnya untuk mendapatkan poin lebih banyak
                            </p>

                            <button
                                className="bg-primary-darker flex items-center justify-center text-lg border border-primary-brass rounded-xl px-5 py-3 w-3/4 text-white"
                                onClick={() => navigate("/")}
                            >
                                <svg className="w-8 h-8" viewBox="0 0 257 257" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.21191" y="1.0437" width="255" height="255" stroke="none" strokeOpacity="0.1" />
                                    <path
                                        d="M90.3558 122.815C86.7055 126.466 86.7055 132.384 90.3558 136.034L138.165 183.844C140.355 186.034 143.906 186.034 146.097 183.844C148.287 181.654 148.287 178.103 146.097 175.912L105.358 135.174C101.453 131.269 101.453 124.937 105.358 121.032L146.317 80.0733C148.142 78.2481 148.142 75.2889 146.317 73.4637C144.492 71.6385 141.533 71.6385 139.707 73.4637L91.6777 121.493L90.3558 122.815Z"
                                        fill="white"
                                    />
                                </svg>
                                <span>Ke halaman utama</span>
                            </button>
                            {userAttempt < 1  && userPoint !== totalPoint && (
                                <Link
                                    reloadDocument={userAttempt < 1}
                                    className={`${
                                        userAttempt < 1 ? "bg-primary-darker border-primary-brass" : "bg-slate-500 border-slate-500"
                                    }  flex items-center justify-center gap-1 text-lg border  rounded-xl px-5 py-3 w-3/4 text-white`}
                                >
                                    <svg className="w-7 h-7" viewBox="0 0 257 257" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.615967" y="1.09473" width="36" height="36" stroke="black" strokeOpacity="0.1" />
                                        <path
                                            d="M135.112 85.7741L135.108 85.7727L113.249 77.086L113.248 77.0855C112.489 76.7843 112.486 75.7006 113.269 75.4059C113.269 75.4057 113.27 75.4055 113.27 75.4053L135.298 67.1908C135.299 67.1903 135.301 67.1897 135.302 67.1892C136.875 66.6065 138.112 65.3864 138.73 63.8469L138.731 63.8434L147.437 42.0318L147.437 42.0307C147.739 41.2724 148.839 41.2707 149.133 42.0515C149.134 42.0518 149.134 42.0521 149.134 42.0525L157.366 64.032C157.367 64.033 157.367 64.0341 157.367 64.0352C157.953 65.6089 159.177 66.8431 160.717 67.4577L160.72 67.459L182.579 76.1458L182.58 76.1462C183.339 76.4475 183.343 77.531 182.56 77.8258C182.559 77.826 182.559 77.8262 182.558 77.8264L160.531 86.0409C160.529 86.0415 160.527 86.0421 160.526 86.0428C158.953 86.6256 157.716 87.8455 157.099 89.3848L157.098 89.3883L148.392 111.2L148.391 111.201C148.089 111.96 146.989 111.961 146.695 111.18C146.695 111.179 146.695 111.179 146.695 111.179L138.462 89.1998C138.462 89.1986 138.462 89.1975 138.461 89.1964C137.876 87.6228 136.652 86.3886 135.112 85.7741Z"
                                            fill="white"
                                            stroke="white"
                                            strokeWidth="5"
                                        />
                                        <path
                                            d="M87.4441 162.267L87.444 162.267L80.6048 143.991C80.0753 142.575 78.976 141.466 77.5866 140.908L77.577 140.904L59.4206 133.691C59.4201 133.69 59.4197 133.69 59.4193 133.69C59.3134 133.648 59.2781 133.602 59.2601 133.573C59.234 133.532 59.2103 133.465 59.2112 133.38C59.2121 133.295 59.237 133.23 59.2629 133.191C59.2801 133.165 59.3151 133.121 59.4223 133.081L59.4225 133.081L77.7386 126.256C77.7387 126.256 77.7389 126.256 77.7391 126.256C79.1543 125.729 80.2659 124.633 80.8271 123.244L80.8272 123.244L80.831 123.234L88.0601 105.117C88.0602 105.117 88.0603 105.117 88.0605 105.116C88.1021 105.013 88.1471 104.978 88.1768 104.959C88.2196 104.932 88.2894 104.907 88.3779 104.908C88.4664 104.909 88.5341 104.935 88.5744 104.962C88.6016 104.98 88.645 105.014 88.684 105.119L88.6841 105.119L95.5233 123.395C96.0528 124.811 97.1521 125.92 98.5415 126.478L98.5511 126.482L116.708 133.695C116.708 133.696 116.708 133.696 116.709 133.696C116.815 133.738 116.85 133.784 116.868 133.813C116.894 133.854 116.918 133.921 116.917 134.006C116.916 134.091 116.891 134.156 116.865 134.195C116.848 134.221 116.813 134.265 116.706 134.305L116.706 134.305L98.3895 141.13C98.3894 141.13 98.3892 141.13 98.389 141.13C96.9738 141.657 95.8622 142.753 95.301 144.142L95.2971 144.152L88.0681 162.269C88.0679 162.269 88.0677 162.269 88.0676 162.27C88.026 162.373 87.981 162.408 87.9513 162.427C87.9085 162.454 87.8387 162.479 87.7502 162.478C87.6618 162.477 87.594 162.451 87.5537 162.424C87.5265 162.406 87.4831 162.372 87.4441 162.267Z"
                                            fill="white"
                                            stroke="white"
                                            strokeWidth="5"
                                        />
                                        <path
                                            d="M157.548 203.515L157.548 203.515L150.709 185.239C150.179 183.823 149.08 182.714 147.69 182.156L147.681 182.152L129.524 174.939C129.524 174.938 129.524 174.938 129.523 174.938C129.417 174.896 129.382 174.85 129.364 174.821C129.338 174.78 129.314 174.713 129.315 174.628C129.316 174.543 129.341 174.478 129.367 174.439C129.384 174.413 129.419 174.369 129.526 174.329L129.526 174.329L147.842 167.504C147.843 167.504 147.843 167.504 147.843 167.504C149.258 166.977 150.37 165.881 150.931 164.492L150.931 164.492L150.935 164.482L158.164 146.365C158.164 146.365 158.164 146.365 158.164 146.364C158.206 146.261 158.251 146.226 158.281 146.207C158.323 146.18 158.393 146.155 158.482 146.156C158.57 146.157 158.638 146.183 158.678 146.21C158.705 146.228 158.749 146.262 158.788 146.367L158.788 146.367L165.627 164.643C165.627 164.643 165.627 164.644 165.627 164.644C166.157 166.059 167.256 167.168 168.645 167.726L168.655 167.73L186.811 174.943C186.812 174.944 186.812 174.944 186.813 174.944C186.918 174.986 186.954 175.032 186.972 175.061C186.998 175.102 187.022 175.169 187.021 175.254C187.02 175.339 186.995 175.404 186.969 175.443C186.952 175.469 186.917 175.513 186.81 175.553L186.809 175.553L168.493 182.378C168.493 182.378 168.493 182.378 168.493 182.378C167.078 182.905 165.966 184.001 165.405 185.39L165.401 185.4L158.172 203.517C158.172 203.517 158.171 203.518 158.171 203.518C158.13 203.621 158.085 203.656 158.055 203.675C158.012 203.702 157.942 203.727 157.854 203.726C157.766 203.725 157.698 203.699 157.657 203.672C157.63 203.654 157.587 203.62 157.548 203.515Z"
                                            fill="white"
                                            stroke="white"
                                            strokeWidth="5"
                                        />
                                    </svg>

                                    <span>Coba lagi</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 justify-center items-center">
                            <img src={dialog.icon} alt="icon" className="w-3/5" />
                            <div className="space-y-3">
                                <p className="text-4xl font-bold text-center text-white">Jawabanmu</p>
                                <p className="text-5xl font-bold text-center text-white">{dialog.title}</p>
                            </div>

                            <div className="space-y-3 flex flex-col items-center m-3 w-4/5">
                                {dialog.title === "Salah" && <p className="text-2xl text-center text-white">Jawaban yang benar</p>}
                                <div className="bg-correct rounded-xl text-white py-3 px-12 w-full text-center text-xl">{currentCorrectAnswer}</div>
                            </div>

                            <form method="dialog">
                                <button className="bg-primary-orange rounded-xl px-12 py-3 text-white" onClick={dialog.onClickButton}>
                                    {dialog.btnTitle}
                                </button>
                            </form>
                        </div>
                    )}
                </dialog>
            ))}
            {dataQuiz && dataQuiz.artworkId && <dialog id="detailImage" className="modal overflow-scroll">
                <form method="dialog">
                    <button
                        className="btn btn-sm btn-circle btn-ghost text-white absolute right-2 top-2"
                        onClick={() => document.getElementById("detailImage").close()}
                    >
                        ✕
                    </button>
                </form>
                <DetailImage artworkId={dataQuiz.artworkId} isModal />
            </dialog>}
        </div>
    );
};

export default QuizCarousel;
