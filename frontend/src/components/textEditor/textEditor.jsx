import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./textEditor.css";

import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatStrikethrough,
  MdFormatUnderlined,
} from "react-icons/md";

function TextEditor({ onChange, value }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Initialize editorState from `value` prop if available
  useEffect(() => {
    if (value) {
      try {
        // Try to parse as JSON
        const contentState = convertFromRaw(JSON.parse(value));
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        // If parsing fails, assume HTML and use convertFromHTML
        const blocksFromHTML = convertFromHTML(value);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [value]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(content))); // Pass serialized content
  };

  const toggleInlineStyle = (e, style) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (e, blockType) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className="textEditor">
      <div className="toolbar">
        <button onMouseDown={(e) => toggleInlineStyle(e, "BOLD")}>
          <MdFormatBold /> <span>Bold</span>
        </button>
        <button onMouseDown={(e) => toggleInlineStyle(e, "ITALIC")}>
          <MdFormatItalic /> <span>Italic</span>
        </button>
        <button onMouseDown={(e) => toggleInlineStyle(e, "UNDERLINE")}>
          <MdFormatUnderlined /> <span>Underline</span>
        </button>
        <button onMouseDown={(e) => toggleInlineStyle(e, "STRIKETHROUGH")}>
          <MdFormatStrikethrough /> <span>Strike</span>
        </button>

        <button onMouseDown={(e) => toggleBlockType(e, "unordered-list-item")}>
          <MdFormatListBulleted /> <span>Bullet List</span>
        </button>
        <button onMouseDown={(e) => toggleBlockType(e, "ordered-list-item")}>
          <MdFormatListNumbered /> <span>Numbered List</span>
        </button>
      </div>
      <Editor editorState={editorState} onChange={handleEditorChange} />
    </div>
  );
}

export default TextEditor;
