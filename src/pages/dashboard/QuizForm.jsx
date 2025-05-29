import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { createQuiz, getQuiz, updateQuiz } from "../../lib/firebase/quiz";
import BackIcon from "../../components/BackIcon";
import { getArtworksNoQuiz } from "../../lib/firebase/artwork";
import LoadingScreen from "../../components/LoadingScreen";

const QUIZ_INPUTS = [
    {
        name: "title",
        label: "Title",
        type: "text",
    },
    {
        name: "artworkId",
        label: "Artwork",
        type: "select",
    },
];

const QuizForm = () => {
    const [loading, setLoading] = useState(true);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [artworkOptions, setArtworkOptions] = useState([]);
    const params = useParams();
    const type = params.id === "create" ? "create" : params.id;

    const navigate = useNavigate();

    const schema = z.object({
        title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
        artworkId: z.string().min(1, { message: "Artwork ID must be at least 1 characters long" }),
        questions: z.array(
            z.object({
                question: z.string().min(1, "Pertanyaan tidak boleh kosong"),
                options: z.array(z.string().min(1, "Opsi tidak boleh kosong")).length(4, "Harus ada 4 opsi"),
                correctAnswer: z.string().min(1, "Jawaban tidak boleh kosong"),
                point: z.string().min(1, "Poin tidak boleh kosong"),
                image: z.any().optional(),
            })
        ),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            artworkId: "",
            questions: [
                {
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                    point: "10",
                    image: null,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const watchQuestions = watch("questions");

    const fetchQuizData = async () => {
        try {
            const quizData = await getQuiz(params.id);
            reset(quizData);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const getArtworkOptions = async () => {
        try {
            const artworkData = await getArtworksNoQuiz(params.id);
            const mappedData = artworkData.map((artwork) => ({
                value: artwork.id,
                label: artwork.title,
            }));
            setArtworkOptions(mappedData);
            setLoadingOptions(false);
        } catch (error) {
            console.error("Error fetching artwork data:", error);
            return [];
        }
    };

    useEffect(() => {
        getArtworkOptions();
        if (type === "create") {
            setLoading(false);
            return;
        }
        if (!loadingOptions) {
            fetchQuizData();
        }
    }, [loadingOptions]);

    const addQuestion = () => {
        append({
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "",
            point: "10",
            image: null,
        });
    };

    const onSubmit = async (data) => {
        try {
            type === "create" ? await createQuiz(data) : await updateQuiz(data, params.id);
            navigate(`/dashboard/quiz`);
        } catch (error) {
            console.error("Gagal menambahkan quiz ke quiz:", error);
        }
    };

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-base-100 shadow-lg rounded-lg">
            <BackIcon />
            {QUIZ_INPUTS.map((input) => (
                <div key={input.name} className="flex flex-col gap-2">
                    <label>{input.label}</label>
                    <div htmlFor={input.name} className="flex items-center gap-2">
                        {input.type === "textarea" && (
                            <textarea id={input.name} placeholder={input.label} {...register(input.name)} className="textarea input-bordered w-full h-24" />
                        )}
                        {input.type === "text" && (
                            <input
                                id={input.name}
                                type={input.type}
                                {...register(input.name)}
                                disabled={isSubmitting}
                                className={`text-black ${input.type === "file" ? "file-input file-input-bordered" : "input input-bordered"} w-full ${
                                    input.className
                                }`}
                                placeholder={input.label}
                            />
                        )}
                        {input.type === "select" && (
                            <select id={input.name} {...register(input.name)} className="select select-bordered w-full">
                                <option value="">Pilih Artwork</option>
                                {artworkOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {errors[input.name] && <p className="text-xs text-red-600 mt-2 text-end">{errors[input.name].message}</p>}
                </div>
            ))}
            {fields.map((q, index) => (
                <div key={q.id} className="card bg-base-200 p-4 rounded-lg shadow-md space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text font-bold">Pertanyaan {index + 1}</span>
                        </label>
                        <input
                            {...register(`questions.${index}.question`)}
                            type="text"
                            placeholder="Masukkan pertanyaan"
                            className="input input-bordered w-full"
                        />
                        {errors.questions?.[index]?.question && <p className="text-error text-sm mt-1">{errors.questions[index].question.message}</p>}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text font-bold">Gambar untuk Pertanyaan</span>
                        </label>
                        <input {...register(`questions.${index}.image`)} type="file" accept="image/*" className="file-input file-input-bordered w-full" />
                        {errors.questions?.[index]?.image && <p className="text-error text-sm mt-1">{errors.questions[index].image.message}</p>}
                        {watchQuestions[index].image instanceof FileList && watchQuestions[index].image.length > 0 && (
                            <img src={URL.createObjectURL(watchQuestions[index].image[0])} alt="Question" className="mt-5 h-40 mx-auto" />
                        )}
                        {watchQuestions[index].image && typeof watchQuestions[index].image === "string" && (
                            <img src={watchQuestions[index].image} alt="Question" className="mt-5 h-40 mx-auto" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="label">
                            <span className="label-text font-bold">Pilihan Jawaban</span>
                        </label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {q.options.map((option, optIndex) => (
                                <div key={optIndex}>
                                    <input
                                        {...register(`questions.${index}.options.${optIndex}`)}
                                        type="text"
                                        placeholder={`Opsi ${optIndex + 1}`}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.questions?.[index]?.options?.[optIndex] && (
                                        <p className="text-error text-sm mt-1">{errors.questions[index].options[optIndex].message}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text font-bold">Pilih jawaban yang benar</span>
                        </label>
                        {watchQuestions[index]?.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center mt-1">
                                <label className="flex items-center">
                                    <input type="radio" value={option} {...register(`questions.${index}.correctAnswer`)} className="radio radio-info mr-2" />
                                    <span>{option}</span>
                                </label>
                            </div>
                        ))}
                        {errors.questions?.[index]?.correctAnswer && <p className="text-error text-sm mt-1">{errors.questions[index].correctAnswer.message}</p>}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text font-bold">Poin untuk pertanyaan ini</span>
                        </label>
                        <input type="text" {...register(`questions.${index}.point`)} placeholder="Masukkan poin" className="input input-bordered w-full" />
                        {errors.questions?.[index]?.point && <p className="text-error text-sm mt-1">{errors.questions[index].point.message}</p>}
                    </div>

                    <button type="button" onClick={() => remove(index)} className="btn btn-outline btn-error mt-2">
                        Hapus Pertanyaan
                    </button>
                </div>
            ))}

            <div className="flex justify-center items-center gap-2">
                <button type="button" onClick={addQuestion} className="btn btn-outline">
                    Tambah Pertanyaan
                </button>

                <button type="submit" className="btn btn-outline btn-info">
                    Submit Quiz
                </button>
            </div>
        </form>
    );
};

export default QuizForm;
