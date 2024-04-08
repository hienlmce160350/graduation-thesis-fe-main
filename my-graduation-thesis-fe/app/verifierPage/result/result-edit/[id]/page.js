"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../../context/withAuth";
import Link2 from "next/link";
import {
  HtmlEditor,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
  PasteCleanup,
  Table,
} from "@syncfusion/ej2-react-richtexteditor";
import { hideElementsWithStyle } from "@/libs/commonFunction";
import { hideElementsFreeWithStyle } from "@/libs/commonFunction";

const ResultEdit = () => {
  const resultId = useParams().id;
  const [data, setBlogData] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isCancelMode, setIsCancelMode] = useState(false);

  const [isSaveMode, setIsSaveMode] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsCancelMode(false);
  };

  const handleCancelClick = () => {
    setIsCancelMode(true);
    setIsEditMode(false);
    fetchBlogData();
  };

  const handleSaveClick = () => {
    setIsSaveMode(true);
  };

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Result editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Result Edited Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // ckEditor
  // ckEditor
  const toolbarSettings = {
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "SuperScript",
      "SubScript",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "|",
      "Outdent",
      "Indent",
      "|",
      "CreateLink",
      "CreateTable",
      "|",
      "SourceCode",
      "Undo",
      "Redo",
    ],
  };
  const [editorValue, setEditorValue] = useState("");
  const handleValueChange = (args) => {
    setEditorValue(args.value);
    formik.setFieldValue("description", args.value);
  };
  // end ckEditor

  // Load API Detail Blog

  const fetchBlogData = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersverifier.azurewebsites.net/api/Result/GetById/${resultId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBlogData(data);
        formik.setFieldValue("id", data.id);
        formik.setFieldValue("title", data.title);
        setEditorValue(data.description);
        formik.setFieldValue("description", data.description);
        if (data.status == 0) {
          formik.setFieldValue("status", "In Progress");
        } else if (data.status == 1) {
          formik.setFieldValue("status", "Confirmed");
        } else {
          formik.setFieldValue("status", "Rejected");
        }
      } else {
        notification.error({
          message: "Failed to fetch result data",
        });
      }
    } catch (error) {
      console.error("Error fetching result data", error);
    }
  };
  // End load API Detail Blog

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      status: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Result Tilte can't be empty"),
      description: Yup.string().required("Result Description can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        if ((!isEditMode && !isCancelMode) || isSaveMode) {
          const bearerToken = Cookies.get("token");
          if (values.status != 1 && values.status != 0 && values.status != 2) {
            if (values.status === "In Progress") {
              values.status = Number(0);
            } else if (values.status === "Confirmed") {
              values.status = Number(1);
            } else if (values.status === "Rejected") {
              values.status = Number(2);
            }
          } else if (
            values.status == 1 ||
            values.status == 0 ||
            values.status == 2
          ) {
            values.status = Number(values.status);
          }
          const response = await fetch(
            `https://ersverifier.azurewebsites.net/api/Result/Update/${resultId}`,
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: JSON.stringify(values),
            }
          );

          if (response.ok) {
            Notification.success(successMess);
            router.push("/verifierPage/result/result-list");
          } else {
            Notification.error(errorMess);
          }
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating result information:", error);
      }
    },
  });

  useEffect(() => {
    hideElementsFreeWithStyle();
    hideElementsWithStyle();
    fetchBlogData();
  }, []);
  return (
    <div className="mx-auto w-full mt-3 h-fit mb-3">
      <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border">
        <h2 className="text-[32px] font-medium mb-3 text-center">
          {isEditMode ? "Update Result" : "Result Information"}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <input
              value={formik.values.id}
              name="id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hidden
            ></input>
            <div>
              <label>Result Title</label>
              <input
                name="title"
                id="title"
                type="text"
                placeholder="Result Title"
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                disabled={!isEditMode}
              />
            </div>
            {formik.touched.title && !isCancelMode && formik.errors.title ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.title}
              </div>
            ) : null}
            <div>
              <label>Result Description</label>
              <div className="flex">
                <RichTextEditorComponent
                  id="description"
                  name="description"
                  ref={(richtexteditor) => {
                    formatPainterRTE = richtexteditor;
                  }}
                  toolbarSettings={toolbarSettings}
                  value={editorValue}
                  change={handleValueChange}
                  enabled={isEditMode}
                  className="opacity-100"
                >
                  <Inject
                    services={[
                      HtmlEditor,
                      Toolbar,
                      QuickToolbar,
                      Link,
                      Table,
                      PasteCleanup,
                    ]}
                  />
                </RichTextEditorComponent>
              </div>
            </div>
            {formik.touched.description &&
            !isCancelMode &&
            formik.errors.description ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.description}
              </div>
            ) : null}

            <div>
              <label>Status</label>
              <Select
                name="status"
                id="status"
                className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                style={{ width: 160, height: 41 }}
                placeholder="Active or Inactive"
                onChange={(value) => formik.setFieldValue("status", value)}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                disabled={!isEditMode}
              >
                <Select.Option value="0">In Progress</Select.Option>
                <Select.Option value="1">Confirmed</Select.Option>
                <Select.Option value="2">Rejected</Select.Option>
              </Select>
            </div>

            <div className="flex justify-start gap-4 mt-4 mb-2">
              {isEditMode ? (
                <button
                  className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                  type="submit"
                  onClick={handleSaveClick}
                >
                  <span className="text-xl font-bold">Save</span>
                </button>
              ) : (
                <button
                  className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                  type="button"
                  onClick={handleEditClick}
                >
                  <span className="text-xl font-bold">Update</span>
                </button>
              )}
              {isEditMode ? (
                <button
                  className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                  type="button"
                  onClick={handleCancelClick}
                >
                  <span className="text-xl font-bold">Cancel</span>
                </button>
              ) : (
                <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]">
                  <Link2 href={`/verifierPage/result/result-list`}>
                    <p className="text-xl font-bold">Back</p>
                  </Link2>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(ResultEdit, "verifier");
