"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Editor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Underline from '@tiptap/extension-underline';
// import CodeBlock from '@tiptap/extension-code-block';

interface EditorContextType {
  editor: Editor | null;
  title: string;
  setEditor: React.Dispatch<React.SetStateAction<Editor | null>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  // const editor = useEditor({
  //   extensions: [
  //     Link.configure({
  //       // openOnClick: false,
  //       // linkOnPaste: true,
  //     }),
  //     StarterKit.configure({
  //       codeBlock: false,
  //     }),
  //     Image,
  //     Underline,
  //     CodeBlock,
  //   ],
  //   content: "<p>Start writing your blog post here...</p>",
  //   editorProps: {
  //     attributes: {
  //       class:
  //         "prose max-w-none focus:outline-none text-xl tracking-[2px] break-all leading- text-primary",
  //     },
  //     // handlePaste: (view, event, slice) => {
  //     //   // This will prevent the default paste behavior
  //     //   return false;
  //     // },
  //   },
  // });

  const value = useMemo(() => ({ editor, title, setTitle, setEditor }), [editor, title]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};