import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

const RichText = ({ name, setFieldValue, value }) => {
    const editorRef = useRef(null);

    return (
        <Editor
            tinymceScriptSrc={`/tinymce/tinymce.min.js`}
            value={value}
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={(content) => setFieldValue(name, content)}
            init={{
                height: 500,
                menubar: true,
                block_formats: "Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6",
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "fullscreen",
                    "insertdatetime",
                    "code",
                    "help",
                    "wordcount",
                    "emoticons",
                    "fontsize"
                ],
                toolbar:
                    "undo redo | blocks | " +
                    "fontfamily fontsize | bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help | link",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                contextmenu: "undo redo | inserttable | cell row column deletetable | help",
            }}
        />
    );
};

export default RichText;
