import React, { useEffect, useState } from "react";
import "suneditor/dist/css/suneditor.min.css";

interface TextEditorProps {
  onChange: (content: string) => void;
  value?: string;
}

const TextEditor = React.forwardRef<HTMLDivElement, TextEditorProps>(({ onChange, value }, ref) => {
  const [SunEditor, setSunEditor] = useState<any>(null);

  useEffect(() => {
    import("suneditor-react").then((mod) => {
      setSunEditor(() => mod.default);
    });
  }, []);

  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <div ref={ref}>
      {SunEditor && (
        <SunEditor
          onChange={handleChange}
          setOptions={{
            height: 500,
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline", "strike"],
              [
                "fontColor",
                "hiliteColor",
                "align",
                "horizontalRule",
                "list",
                "table",
              ],
              ["outdent", "indent"],
              ["image", "link", "video"],
              ["preview", "print", "fullScreen"],
            ],
          }}
          defaultValue={value} // Set the initial value
        />
      )}
    </div>
  );
});

export default TextEditor;
