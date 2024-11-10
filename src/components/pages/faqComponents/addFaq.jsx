/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ArrowLeft } from "react-feather";
import axios from "axios";
import { message } from "antd";
import axiosInstance, { headers } from "../ApiFunction/axiosInstance";
import { createFaq } from "../../api/faq";
const AddFaq = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title: title,
      subtitle: description,
    };
    setIsProcessing(true);
    try {
      const res = await createFaq({ data: formData });
      if (res.status === 200) {
        navigate("/faq");
        message.success("Faq Created Successfully");
        setCaption("");
        setTitle("");
      } else {
        message.error("Failed to Create Faq");
        setCaption("");
        setTitle("");
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCKEditor = (event, editor) => {
    const data = editor.getData();
    setDescription(data);
  };

  return (
    <main className="min-h-screen lg:container py-4 px-4 ">
      <div className="d-flex gap-4 align-items-start w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              navigate("/faq");
            }}
            className="flex items-center justify-center p-2 bg_primary rounded-3"
          >
            <ArrowLeft className="text_white" />
          </button>
        </div>
        <div className="flex flex-col mb-3 w-full">
          <h4 className="plusJakara_semibold text_black">Add FAQs</h4>
          <p className="text_secondary plusJakara_regular">
            Information about your current plan and usages
          </p>
        </div>
      </div>
      <Form
        onSubmit={handleSubmit}
        className="w-full bg_white rounded-3 shadow-md p-4"
      >
        <Form.Group className="shadow_def px-3 w-full">
          <Form.Label className="plusJakara_semibold text_dark">
            FAQ Title
          </Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px 20px" }}
            className="custom_control rounded-3 plusJakara_regular text_secondarydark bg_white shadow-sm border"
            placeholder="Enter FAQ title"
          />
        </Form.Group>
        <hr style={{ color: "#f4f4f4", margin: "8px" }} />
        <Form.Group className="shadow_def px-3 mb-3">
          <Form.Label className="plusJakara_semibold text_dark">
            FAQ Description
          </Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "ckfinder",
                "|",
                "mediaEmbed",
                "insertTable",
                "tableColumn",
                "tableRow",
                "mergeTableCells",
                "|",
                "undo",
                "redo",
              ],
            }}
            onChange={handleCKEditor}
          />
        </Form.Group>
        <div className="flex justify-content-end my-4 w-100">
          {!isProcessing ? (
            <button
              type="submit"
              className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center"
            >
              <span className="plusJakara_semibold text_white">Add FAQ</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center"
            >
              <CircularProgress size={18} className="text_white" />
            </button>
          )}
        </div>
      </Form>
    </main>
  );
};

export default AddFaq;
